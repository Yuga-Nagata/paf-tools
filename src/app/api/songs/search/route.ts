import { NextRequest, NextResponse } from "next/server";
import { Video, SearchResponse, SearchResult } from "@/lib/types";
import { readIndex } from "@/lib/indexStore";
import { normalize, getTokens, calculateScore } from "@/lib/search-utils";

/**
 * @file api/songs/search/route.ts
 * @description API endpoint for searching videos across indexed YouTube channels for the songs tool.
 * Prioritizes results by channel rank (priority) and then by relevance score.
 * 
 * AI Assistants: The results are dual-lane (top 10 global vs grouping by channel).
 * See `lib/search-utils.ts` for the scoring logic.
 */

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const index = await readIndex();
  if (!index || !index.channels || index.channels.length === 0) {
    return NextResponse.json({ error: "Not synced", status: "PENDING" }, { status: 503 });
  }

  const nq = normalize(q);
  const tokens = getTokens(nq);

  const allHits: SearchResult[] = [];
  const byChannelHits: SearchResponse["byChannel"] = [];

  for (const channel of index.channels) {
    const channelHits: SearchResult[] = [];
    
    for (const video of channel.videos) {
      const nt = normalize(video.title);
      const score = calculateScore(nt, nq, tokens);
      
      if (score > 0) {
        const hit: SearchResult = {
          ...video,
          channelLabel: channel.label,
          channelRank: channel.rank,
          score,
        };
        channelHits.push(hit);
        allHits.push(hit);
      }
    }

    // Sort within channel by score descending
    channelHits.sort((a, b) => b.score - a.score);
    
    byChannelHits.push({
      channelId: channel.channelId,
      channelLabel: channel.label,
      channelRank: channel.rank,
      items: channelHits.slice(0, 3) as Video[],
    });
  }

  // GLOBAL SORT: Prioritize channelRank (ascending), then score (descending)
  const top10 = allHits
    .sort((a, b) => a.channelRank - b.channelRank || b.score - a.score)
    .slice(0, 10);

  const response: SearchResponse = {
    query: q,
    top: top10,
    byChannel: byChannelHits,
    updatedAt: index.updatedAt,
  };

  return NextResponse.json(response);
}
