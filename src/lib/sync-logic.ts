/**
 * @file sync-logic.ts
 * @description Orchestrates the synchronization process across multiple channels.
 * This logic is shared between the Next.js API route and the CLI script used in GitHub Actions.
 */

import { fetchChannelVideos } from "./ytdlp";
import { readIndex, writeIndex, upsertVideos } from "./indexStore";
import { CHANNELS } from "@/constants/channels";

/**
 * Options for the synchronization process.
 */
export interface SyncOptions {
  /** 
   * 'full': Scans all videos.
   * 'daily': Stops at the first known video (fast incremental update).
   * 'backfill': Only processes channels that are marked as incomplete.
   */
  mode: "full" | "daily" | "backfill";
  /** Optional callback for progress updates. */
  onProgress?: (data: {
    label: string;
    channelId: string;
    videosAdded: number;
    totalVideosAdded: number;
  }) => void;
  /** Optional callback for error reporting per channel. */
  onError?: (data: {
    label: string;
    channelId: string;
    message: string;
  }) => void;
}

/**
 * Summary result of the synchronization process.
 */
export interface SyncResult {
  ok: boolean;
  mode: string;
  channelsProcessed: number;
  videosAdded: number;
  errors: string[];
}

/**
 * Performs the synchronization of YouTube channels into the local index.
 * 
 * @param {SyncOptions} options - Configuration for the sync.
 * @returns {Promise<SyncResult>} The result summary of the sync operation.
 */
export async function performSync(options: SyncOptions): Promise<SyncResult> {
  const { mode, onProgress, onError } = options;
  const data = await readIndex();
  const errors: string[] = [];
  let totalVideosAdded = 0;
  let channelsProcessed = 0;

  for (const channelDef of CHANNELS) {
    const channelId = channelDef.channelId;
    const label = channelDef.label;
    const rank = channelDef.rank;

    // mode=backfill skip if already complete
    if (mode === "backfill") {
      const existingChannel = data.channels.find(c => c.channelId === channelId);
      if (existingChannel?.syncState?.backfill?.isComplete) {
        continue;
      }
    }

    try {
      console.log(`[Sync] Starting channel: ${label} (${channelId})`);
      channelsProcessed++;
      
      const generator = fetchChannelVideos(channelId);
      // In daily mode, we use a Set for fast lookup of existing videos
      const existingVideos = mode === "daily" 
        ? new Set(data.channels.find(c => c.channelId === channelId)?.videos.map(v => v.videoId) || []) 
        : null;

      let channelComplete = true;

      for await (const batch of generator) {
        let batchToUpsert = batch;
        
        if (mode === "daily" && existingVideos) {
          const overlapIndex = batch.findIndex(v => existingVideos.has(v.videoId));
          if (overlapIndex !== -1) {
            batchToUpsert = batch.slice(0, overlapIndex);
            upsertVideos(data, channelId, label, rank, batchToUpsert);
            totalVideosAdded += batchToUpsert.length;
            if (onProgress) {
              onProgress({ label, channelId, videosAdded: batchToUpsert.length, totalVideosAdded });
            }
            channelComplete = true; 
            break; 
          }
        }

        upsertVideos(data, channelId, label, rank, batchToUpsert);
        totalVideosAdded += batchToUpsert.length;
        
        // Write index periodically (every 30 videos) for progress safety
        await writeIndex(data);
        
        if (onProgress) {
          onProgress({ label, channelId, videosAdded: batchToUpsert.length, totalVideosAdded });
        }
      }

      // Update sync state only if the channel was fully processed (not interrupted by errors)
      if (channelComplete) {
        let channelData = data.channels.find(c => c.channelId === channelId);
        if (channelData) {
          channelData.syncState.backfill.isComplete = true;
          channelData.syncState.backfill.lastRunAt = new Date().toISOString();
        }
        await writeIndex(data);
      }

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${label} (${channelId}): ${msg}`);
      if (onError) {
        onError({ label, channelId, message: msg });
      }
    }
  }

  data.updatedAt = new Date().toISOString();
  await writeIndex(data);

  return {
    ok: true,
    mode,
    channelsProcessed,
    videosAdded: totalVideosAdded,
    errors
  };
}
