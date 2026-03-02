import { describe, it, expect, vi, beforeEach } from "vitest";
import { spawn } from "child_process";
import { fetchChannelVideos } from "./ytdlp";
import { EventEmitter } from "events";
import { Readable } from "stream";

// Final attempt at proper mocking for child_process in Vitest ESM
vi.mock("child_process", async (importOriginal) => {
  const actual = await importOriginal() as any;
  const mockSpawn = vi.fn();
  return {
    ...actual,
    default: { ...actual, spawn: mockSpawn },
    spawn: mockSpawn,
  };
});

describe("ytdlp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("yields videos from stdout JSON lines", async () => {
    const mockStdout = new Readable({
      read() {
        this.push(JSON.stringify({ id: "v1", title: "Video 1", upload_date: "20240101", thumbnail: "url1" }) + "\n");
        this.push(JSON.stringify({ id: "v2", title: "Video 2", upload_date: "20240102", thumbnail: "url2" }) + "\n");
        this.push(null);
      }
    });

    const mockChild = new EventEmitter() as any;
    mockChild.stdout = mockStdout;
    mockChild.stderr = new Readable({ read() {} });
    mockChild.kill = vi.fn();
    mockChild.exitCode = null;
    
    vi.mocked(spawn).mockReturnValue(mockChild);

    // Simulate process exit
    setTimeout(() => {
      mockChild.exitCode = 0;
      mockChild.emit("close", 0);
    }, 10);

    const generator = fetchChannelVideos("UC123");
    const results: any[] = [];
    for await (const batch of generator) {
      results.push(...batch);
    }

    expect(results).toHaveLength(2);
    expect(results[0].videoId).toBe("v1");
    expect(results[0].publishedAt).toBe("2024-01-01T00:00:00Z");
  });

  it("handles empty upload_date correctly", async () => {
    const mockStdout = new Readable({
      read() {
        this.push(JSON.stringify({ id: "v1", title: "Video 1" }) + "\n");
        this.push(null);
      }
    });

    const mockChild = new EventEmitter() as any;
    mockChild.stdout = mockStdout;
    mockChild.stderr = new Readable({ read() {} });
    mockChild.kill = vi.fn();
    mockChild.exitCode = null;
    
    vi.mocked(spawn).mockReturnValue(mockChild);
    setTimeout(() => {
      mockChild.exitCode = 0;
      mockChild.emit("close", 0);
    }, 10);

    const generator = fetchChannelVideos("UC123");
    const results: any[] = [];
    for await (const batch of generator) {
      results.push(...batch);
    }

    expect(results).toHaveLength(1);
    expect(results[0].publishedAt).toBe("");
  });

  it("rejects on process error", async () => {
    const mockStdout = new Readable({ read() { this.push(null); } });
    const mockChild = new EventEmitter() as any;
    mockChild.stdout = mockStdout;
    mockChild.stderr = new Readable({ read() {} });
    mockChild.kill = vi.fn();
    mockChild.exitCode = null;
    
    vi.mocked(spawn).mockReturnValue(mockChild);
    setTimeout(() => {
      mockChild.exitCode = 1;
      mockChild.emit("close", 1);
    }, 10);

    const generator = fetchChannelVideos("UC123");
    await expect(async () => {
      for await (const _ of generator) {}
    }).rejects.toThrow("yt-dlp process exited with code 1");
  });
});
