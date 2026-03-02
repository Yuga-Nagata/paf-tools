/**
 * @file types.ts
 * @description Core data structure definitions for YouTube video metadata and search results.
 * Optimized for AI-based static analysis and type-safe data handling.
 */

/**
 * Represents a YouTube channel configuration with its priority rank.
 */
export interface Channel {
  channelId: string;
  label: string;
  rank: number;
}

/**
 * Represents a single YouTube video record in the index.
 */
export interface Video {
  videoId: string;
  title: string;
  publishedAt: string; // ISO 8601 string or empty if unknown
  thumbnailUrl: string;
}

/**
 * Detailed synchronization state for a channel, tracking backfill and daily runs.
 */
export interface SyncState {
  backfill: {
    nextPageToken: string | null;
    isComplete: boolean;
    lastRunAt: string | null;
  };
}

/**
 * Data structure for a channel and its collection of videos as stored in the index.
 */
export interface ChannelData {
  channelId: string;
  label: string;
  rank: number;
  videos: Video[];
  syncState: SyncState;
}

/**
 * The root structure of the `index.json` storage file.
 */
export interface IndexData {
  schemaVersion: number;
  updatedAt: string;
  channels: ChannelData[];
}

/**
 * Search hit structure including relevance score and channel metadata.
 */
export interface SearchResult extends Video {
  channelLabel: string;
  channelRank: number;
  score: number;
}

/**
 * Complete API response for a search query.
 */
export interface SearchResponse {
  /** The original search query string provided by the user */
  query: string;
  /** Array of top 10 search results ordered by score and channel rank */
  top: SearchResult[];
  /** Grouped results categorized by channel, limited to top 3 per channel */
  byChannel: {
    channelId: string;
    channelLabel: string;
    channelRank: number;
    /** Array of top 3 most relevant videos for this specific channel */
    items: Video[];
  }[];
  /** ISO 8601 formatted timestamp indicating the freshness of the source index */
  updatedAt: string;
}
