/**
 * @file ytdlp.ts
 * @description Wrapper around the yt-dlp CLI tool for fetching YouTube video metadata.
 * Uses an async generator to yield results in batches, allowing for efficient memory usage
 * and periodic saving of progress.
 */

import { spawn } from "child_process";
import readline from "readline";
import { Video } from "./types";

/**
 * Fetches videos from a YouTube channel using yt-dlp.
 * Yields videos in batches of 30.
 * 
 * @param {string} channelId - The ID of the channel to fetch videos from.
 * @yields {Promise<Video[]>} A batch of video objects.
 */
export async function* fetchChannelVideos(channelId: string): AsyncGenerator<Video[]> {
  // Use --flat-playlist for speed.
  // --print json format allows us to get structured data line by line.
  const child = spawn("yt-dlp", [
    "--flat-playlist",
    "--print-json",
    `https://www.youtube.com/channel/${channelId}/videos`
  ]);

  const rl = readline.createInterface({
    input: child.stdout,
    terminal: false
  });

  // Handle stderr to log yt-dlp errors
  child.stderr.on("data", (data) => {
    const msg = data.toString().trim();
    if (msg.includes("ERROR:")) {
      console.error(`yt-dlp [${channelId}]: ${msg}`);
    }
  });

  let currentBatch: Video[] = [];

  // Ensure the process is closed before finishing
  try {
    for await (const line of rl) {
      try {
        const data = JSON.parse(line);
        if (data.id && data.title) {
          // upload_date format is YYYYMMDD. Convert to ISO 8601 if present.
          let publishedAt = "";
          if (data.upload_date && /^\d{8}$/.test(data.upload_date)) {
            publishedAt = `${data.upload_date.slice(0, 4)}-${data.upload_date.slice(4, 6)}-${data.upload_date.slice(6, 8)}T00:00:00Z`;
          }

          currentBatch.push({
            videoId: data.id,
            title: data.title,
            publishedAt,
            thumbnailUrl: data.thumbnail || `https://i.ytimg.com/vi/${data.id}/mqdefault.jpg`
          });

          if (currentBatch.length >= 30) {
            yield currentBatch;
            currentBatch = [];
          }
        }
      } catch (e) {
        console.error("Failed to parse yt-dlp output line:", line, e);
      }
    }

    if (currentBatch.length > 0) {
      yield currentBatch;
    }
  } finally {
    // Kill the process if it's still running (e.g. generator closed early)
    if (child.exitCode === null || child.exitCode === undefined) {
      child.kill("SIGTERM");
    }

    // Ensure the process is closed before finishing and throw if it failed
    await new Promise<void>((resolve, reject) => {
      // If already exited, resolve/reject immediately
      if (typeof child.exitCode === "number") {
        if (child.exitCode === 0) resolve();
        else reject(new Error(`yt-dlp process exited with code ${child.exitCode}`));
        return;
      }

      // Otherwise wait for close
      child.on("close", (code) => {
        if (code === 0 || code === null) resolve();
        else reject(new Error(`yt-dlp process exited with code ${code}`));
      });
      child.on("error", reject);
    });
  }
}
