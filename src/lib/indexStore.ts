import fs from "fs/promises";
import path from "path";
import { IndexData, Video } from "./types";

const INDEX_FILE = path.join(process.cwd(), "data", "songs", "index.json");

/**
 * Reads the current index data from the filesystem.
 * If the file does not exist, returns an initial schema structure.
 * @returns {Promise<IndexData>} The parsed index data.
 */
export async function readIndex(): Promise<IndexData> {
  try {
    const content = await fs.readFile(INDEX_FILE, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    // Return initial schema if file not found
    return {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      channels: []
    };
  }
}

/**
 * Writes index data to the filesystem atomically using a temporary file.
 * This prevents data corruption during long-running sync processes.
 * @param {IndexData} data - The data structure to write.
 */
export async function writeIndex(data: IndexData): Promise<void> {
  const tmpFile = `${INDEX_FILE}.tmp`;
  await fs.mkdir(path.dirname(INDEX_FILE), { recursive: true });
  await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpFile, INDEX_FILE);
}

/**
 * Updates or inserts a collection of videos into a specific channel in the index.
 * Handles deduplication by `videoId` and maintains sorting by `publishedAt` descending.
 * 
 * @param {IndexData} data - The index data to modify (in-place).
 * @param {string} channelId - The target YouTube channel ID.
 * @param {string} label - Fallback label for the channel.
 * @param {number} rank - Priority rank for the channel.
 * @param {Video[]} newVideos - Collection of new videos to add.
 */
export function upsertVideos(
  data: IndexData,
  channelId: string,
  label: string,
  rank: number,
  newVideos: Video[]
): void {
  let channel = data.channels.find(c => c.channelId === channelId);

  if (!channel) {
    channel = {
      channelId,
      label,
      rank,
      videos: [],
      syncState: {
        backfill: {
          nextPageToken: null,
          isComplete: false,
          lastRunAt: null
        }
      }
    };
    data.channels.push(channel);
  }

  // Merge and deduplicate
  const existingMap = new Map(channel.videos.map(v => [v.videoId, v]));
  
  for (const video of newVideos) {
    existingMap.set(video.videoId, video);
  }

  // Convert back to array and sort by publishedAt descending
  // Videos with empty publishedAt are treated as older
  const sorted = Array.from(existingMap.values()).sort((a, b) => {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  channel.videos = sorted;
  // Sync total channel rank if definition changed
  channel.rank = rank;
  channel.label = label;
}
