import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs/promises";
import { readIndex, writeIndex, upsertVideos } from "./indexStore";
import { IndexData, Video } from "./types";

vi.mock("fs/promises");

describe("indexStore", () => {
  const mockFile = "data/index.json";
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("readIndex", () => {
    it("returns parsed data if file exists", async () => {
      const mockData: IndexData = { schemaVersion: 1, updatedAt: "now", channels: [] };
      vi.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(mockData));
      
      const result = await readIndex();
      expect(result).toEqual(mockData);
    });

    it("returns initial schema if file missing", async () => {
      vi.spyOn(fs, "readFile").mockRejectedValue(new Error("File not found"));
      
      const result = await readIndex();
      expect(result.schemaVersion).toBe(1);
      expect(result.channels).toEqual([]);
    });
  });

  describe("writeIndex", () => {
    it("writes atomically using tmp file", async () => {
      const mockData: IndexData = { schemaVersion: 1, updatedAt: "now", channels: [] };
      const mkdirSpy = vi.spyOn(fs, "mkdir").mockResolvedValue(undefined);
      const writeFileSpy = vi.spyOn(fs, "writeFile").mockResolvedValue(undefined);
      const renameSpy = vi.spyOn(fs, "rename").mockResolvedValue(undefined);
      
      await writeIndex(mockData);
      
      expect(mkdirSpy).toHaveBeenCalled();
      expect(writeFileSpy).toHaveBeenCalledWith(expect.stringContaining(".tmp"), expect.any(String), "utf-8");
      expect(renameSpy).toHaveBeenCalled();
    });
  });

  describe("upsertVideos", () => {
    it("adds new channel if not exists", () => {
      const data: IndexData = { schemaVersion: 1, updatedAt: "now", channels: [] };
      const newVideos: Video[] = [{ videoId: "v1", title: "T1", publishedAt: "2024-01-01T00:00:00Z", thumbnailUrl: "url" }];
      
      upsertVideos(data, "c1", "Channel 1", 1, newVideos);
      
      expect(data.channels).toHaveLength(1);
      expect(data.channels[0].channelId).toBe("c1");
      expect(data.channels[0].videos).toHaveLength(1);
    });

    it("deduplicates videos by videoId", () => {
      const data: IndexData = { 
        schemaVersion: 1, 
        updatedAt: "now", 
        channels: [{
          channelId: "c1",
          label: "L",
          rank: 1,
          videos: [{ videoId: "v1", title: "Old Title", publishedAt: "2024-01-01T00:00:00Z", thumbnailUrl: "url" }],
          syncState: { backfill: { nextPageToken: null, isComplete: false, lastRunAt: null } }
        }] 
      };
      
      const newVideos: Video[] = [{ videoId: "v1", title: "New Title", publishedAt: "2024-01-01T00:00:00Z", thumbnailUrl: "url" }];
      
      upsertVideos(data, "c1", "L", 1, newVideos);
      
      expect(data.channels[0].videos).toHaveLength(1);
      expect(data.channels[0].videos[0].title).toBe("New Title");
    });

    it("sorts videos by publishedAt descending", () => {
      const data: IndexData = { schemaVersion: 1, updatedAt: "now", channels: [] };
      const newVideos: Video[] = [
        { videoId: "v1", title: "Old", publishedAt: "2023-01-01T00:00:00Z", thumbnailUrl: "url" },
        { videoId: "v2", title: "New", publishedAt: "2024-01-01T00:00:00Z", thumbnailUrl: "url" }
      ];
      
      upsertVideos(data, "c1", "L", 1, newVideos);
      
      expect(data.channels[0].videos[0].videoId).toBe("v2");
      expect(data.channels[0].videos[1].videoId).toBe("v1");
    });
  });
});
