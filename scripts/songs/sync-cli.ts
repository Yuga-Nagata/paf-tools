/**
 * @file sync-cli.ts
 * @description Command-line interface for triggering the YouTube channel synchronization process.
 * This script is typically run via `npm run sync-daily` or directly via `tsx`.
 * Supported modes: --mode=full, --mode=daily, --mode=backfill.
 */

import { performSync } from "../../src/lib/sync-logic";

/**
 * Main execution function for the CLI.
 * Parses command-line arguments and invokes the sync logic.
 */
async function main() {
  const args = process.argv.slice(2);
  const modeArg = args.find(a => a.startsWith("--mode="))?.split("=")[1] || "daily";
  const mode = modeArg as "full" | "daily" | "backfill";

  console.log(`Starting sync in ${mode} mode...`);

  const result = await performSync({
    mode,
    onProgress: ({ label, videosAdded, totalVideosAdded }) => {
      console.log(`[${label}] +${videosAdded} videos (Total: ${totalVideosAdded})`);
    },
    onError: ({ label, message }) => {
      console.error(`[${label}] ERROR: ${message}`);
    }
  });

  console.log("-----------------------------------");
  console.log(`Sync completed: ${result.ok ? "SUCCESS" : "FAILED"}`);
  console.log(`Channels processed: ${result.channelsProcessed}`);
  console.log(`Total videos added: ${result.videosAdded}`);
  
  if (result.errors.length > 0) {
    console.log("\nErrors encountered:");
    result.errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal error during sync:", err);
  process.exit(1);
});
