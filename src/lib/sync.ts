/**
 * @file sync.ts
 * @description Master synchronization logic for YouTube channel video indexing.
 * Handles incremental updates, safety limits, and automatic phonetic reading generation.
 */

import fs from "fs/promises";
import path from "path";
import kuromoji from "kuromoji";
import * as wanakana from "wanakana";
import { CHANNELS } from "@/constants/channels";
import { getUploadsPlaylistId, getPlaylistItems, YouTubePlaylistItem } from "./youtube";
import { IndexData, Video, ChannelData } from "./types";

/** Path to the persistent JSON data store */
const DATA_FILE = path.join(process.cwd(), "data", "index.json");

/**
 * Ensures that the directory for the data store exists.
 * Creates the directory recursively if it is missing.
 * 
 * @returns {Promise<void>}
 */
async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Reads the current index from the local file system.
 * 
 * @returns {Promise<IndexData | null>} The parsed index data, or null if the file does not exist or is malformed.
 */
export async function readIndex(): Promise<IndexData | null> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as IndexData;
  } catch {
    return null;
  }
}

/**
 * Writes the provided index data to the local file system.
 * 
 * @param {IndexData} data - The index data structure to persist.
 * @returns {Promise<void>}
 */
export async function writeIndex(data: IndexData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Initializes the kuromoji tokenizer.
 * 
 * @returns {Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>}
 */
async function getTokenizer(): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
  const dictPath = path.join(process.cwd(), "node_modules", "kuromoji", "dict");
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });
}

/**
 * Generates a phonetic reading (Hiragana) for a given text.
 * 
 * @param {kuromoji.Tokenizer<kuromoji.IpadicFeatures>} tokenizer - The initialized kuromoji tokenizer.
 * @param {string} text - The input text (e.g., video title).
 * @returns {string} The Hiragana reading.
 */
function getReading(tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>, text: string): string {
  const tokens = tokenizer.tokenize(text);
  // tokens[i].reading is in Katakana. Convert to Hiragana.
  const reading = tokens.map(t => t.reading || t.surface_form).join("");
  return wanakana.toHiragana(reading);
}

/**
 * Maps a YouTube API response item to the internal Video interface.
 * 
 * @param {YouTubePlaylistItem} item - Raw item from YouTube PlaylistItems API.
 * @param {kuromoji.Tokenizer<kuromoji.IpadicFeatures>} tokenizer - The tokenizer for reading generation.
 * @returns {Video} Internal representation of the video.
 */
function mapPlaylistItem(item: YouTubePlaylistItem, tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>): Video {
  const title = item.snippet.title;
  return {
    videoId: item.snippet.resourceId.videoId,
    title,
    reading: getReading(tokenizer, title),
    thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
    publishedAt: item.snippet.publishedAt,
  };
}

/**
 * Executes a synchronization process for all configured channels.
 * 
 * @param {"full" | "daily"} mode - Sync mode. 
 * @throws {Error} If a fatal error occurs (e.g., Quota Exceeded).
 * @returns {Promise<void>}
 */
export async function syncChannels(mode: "full" | "daily"): Promise<void> {
  const [currentIndex, tokenizer] = await Promise.all([readIndex(), getTokenizer()]);
  
  const existingVideosByChannel = new Map<string, Set<string>>();
  if (currentIndex) {
    for (const ch of currentIndex.channels) {
      existingVideosByChannel.set(ch.channelId, new Set(ch.videos.map(v => v.videoId)));
    }
  }

  const results: ChannelData[] = [];
  const MAX_VIDEOS_FULL = 1000;
  let quotaHit = false;

  const chunks: (typeof CHANNELS)[] = [];
  for (let i = 0; i < CHANNELS.length; i += 5) {
    chunks.push(CHANNELS.slice(i, i + 5));
  }

  for (const chunk of chunks) {
    if (quotaHit) break;

    const chunkResults = await Promise.all(
      chunk.map(async (channel) => {
        if (quotaHit) return null;
        console.log(`Syncing ${channel.label} (${mode})...`);
        try {
          const playlistId = await getUploadsPlaylistId(channel.channelId);
          const videos: Video[] = [];
          
          let pageToken: string | undefined;
          let stop = false;
          const existingVideoIds = existingVideosByChannel.get(channel.channelId) || new Set<string>();

          do {
            const { items, nextPageToken } = await getPlaylistItems(playlistId, pageToken);
            
            for (const item of items) {
              const video = mapPlaylistItem(item, tokenizer);
              if (mode === "daily" && existingVideoIds.has(video.videoId)) {
                stop = true;
                break;
              }
              videos.push(video);
              if (mode === "full" && videos.length >= MAX_VIDEOS_FULL) {
                stop = true;
                break;
              }
            }
            pageToken = nextPageToken;
          } while (pageToken && !stop);

          let finalVideos = videos;
          if (mode === "daily" && currentIndex) {
            const currentChannel = currentIndex.channels.find(c => c.channelId === channel.channelId);
            if (currentChannel) {
              finalVideos = [...videos, ...currentChannel.videos];
            }
          }

          return {
            channelId: channel.channelId,
            label: channel.label,
            rank: channel.rank,
            videos: finalVideos,
          } as ChannelData;
        } catch (err: unknown) {
          const error = err as Error;
          console.error(`Failed to sync channel ${channel.label}:`, error.message);
          if (error.message === "Quota Exceeded") quotaHit = true;
          const currentChannel = currentIndex?.channels.find(c => c.channelId === channel.channelId);
          return currentChannel || {
            channelId: channel.channelId,
            label: channel.label,
            rank: channel.rank,
            videos: [],
          };
        }
      })
    );
    results.push(...chunkResults.filter((r): r is ChannelData => r !== null));
  }

  const newIndex: IndexData = {
    updatedAt: new Date().toISOString(),
    channels: results.sort((a, b) => a.rank - b.rank),
  };

  await writeIndex(newIndex);
}
