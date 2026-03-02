export const maxDuration = 300;

import { NextRequest, NextResponse } from "next/server";
import { performSync } from "@/lib/sync-logic";

/**
 * @file api/songs/sync/route.ts
 * @description API endpoint for triggering YouTube channel synchronization specifically for the songs tool.
 * Supports manual triggers via POST with a SYNC_TOKEN.
 * Uses shared logic in `src/lib/sync-logic.ts`.
 * 
 * AI Assistants: This route is critical for data freshness. It expects a 'mode' query parameter.
 */

export async function POST(req: NextRequest): Promise<NextResponse> {
  const syncToken = req.headers.get("x-sync-token");
  if (syncToken !== process.env.SYNC_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "daily") as "full" | "daily" | "backfill";

  if (!["full", "daily", "backfill"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const result = await performSync({ 
    mode,
    onProgress: ({ label, videosAdded, totalVideosAdded }) => {
      console.log(`[API Sync: ${label}] +${videosAdded} videos (Total Added: ${totalVideosAdded})`);
    },
    onError: ({ label, message }) => {
      console.error(`[API Sync: ${label}] ERROR: ${message}`);
    }
  });

  return NextResponse.json({
    ok: result.ok,
    mode: result.mode,
    channelsProcessed: result.channelsProcessed,
    videosAdded: result.videosAdded,
    errors: result.errors.length > 0 ? result.errors : undefined
  });
}
