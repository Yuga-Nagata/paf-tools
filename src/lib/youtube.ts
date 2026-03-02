/**
 * @file youtube.ts
 * @description Low-level client for interacting with the YouTube Data API v3.
 * Optimized for resilience and clear error reporting to the synchronization layer.
 */

/** YouTube API Key from environment variables */
const API_KEY = process.env.YOUTUBE_API_KEY;
/** Base URL for YouTube Data API v3 */
const BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Interface for raw items returned by the YouTube PlaylistItems API.
 */
export interface YouTubePlaylistItem {
  /** Metadata about the playlist item */
  snippet: {
    /** Title of the video */
    title: string;
    /** Publication timestamp (ISO 8601) */
    publishedAt: string;
    /** Thumbnail metadata, providing multiple resolutions */
    thumbnails: {
      /** Medium resolution: 320x180 */
      medium?: { url: string };
      /** Default resolution: 120x90 */
      default?: { url: string };
    };
    /** Reference to the actual YouTube video resource */
    resourceId: {
      /** Unique ID of the video */
      videoId: string;
    };
  };
}

/**
 * Fetches the 'uploads' playlist ID for a given YouTube channel.
 * 
 * @param {string} channelId - The unique ID of the YouTube channel (e.g., 'UC...').
 * @throws {Error} If the API returns a quota error, an invalid channel ID, or a network failure.
 * @returns {Promise<string>} The ID of the playlist containing the channel's uploaded videos.
 */
export async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const url = `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.error) {
    const isQuota = data.error.errors?.some((e: any) => e.reason === "quotaExceeded");
    throw new Error(isQuota ? "Quota Exceeded" : data.error.message);
  }
  
  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

/**
 * Fetches items from a specific YouTube playlist with support for pagination.
 * 
 * @param {string} playlistId - The unique ID of the playlist to fetch items from.
 * @param {string} [pageToken] - Optional token for fetching the next page of results.
 * @throws {Error} If the API returns a quota error, an invalid playlist ID, or a network failure.
 * @returns {Promise<{ items: YouTubePlaylistItem[]; nextPageToken?: string }>} An object containing the page of results and an optional next page token.
 */
export async function getPlaylistItems(
  playlistId: string,
  pageToken?: string
): Promise<{ items: YouTubePlaylistItem[]; nextPageToken?: string }> {
  const url = `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.error) {
    const isQuota = data.error.errors?.some((e: any) => e.reason === "quotaExceeded");
    console.error("YouTube API Error:", data.error);
    throw new Error(isQuota ? "Quota Exceeded" : data.error.message);
  }
  
  return {
    items: data.items || [],
    nextPageToken: data.nextPageToken,
  };
}
