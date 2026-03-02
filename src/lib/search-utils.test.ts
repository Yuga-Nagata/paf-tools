import { describe, it, expect } from "vitest";
import { normalize, getTokens, calculateScore } from "./search-utils";

describe("search-utils", () => {
  describe("normalize", () => {
    it("converts full-width alphanumeric to half-width", () => {
      expect(normalize("ＡＢＣ１２３")).toBe("abc123");
    });

    it("converts Katakana to Hiragana", () => {
      expect(normalize("カラオケ")).toBe("からおけ");
    });

    it("removes symbols and collapses spaces", () => {
      expect(normalize("【カラオケ】 Title / Artist - Remix")).toBe("からおけ title artist remix");
    });

    it("handles mixed Japanese and English", () => {
      // NOTE: wanakana might convert 'スカート' to 'すかーと' or 'すかあと'
      const normalized = normalize("月曜日の朝、スカートを切られた / 欅坂46");
      expect(normalized).toContain("月曜日の朝");
      expect(normalized).toContain("欅坂46");
      expect(normalized).not.toContain("、");
      expect(normalized).not.toContain("/");
    });
  });

  describe("getTokens", () => {
    it("splits by space and filters short tokens", () => {
      const tokens = getTokens("からおけ title a");
      expect(tokens).toEqual(["からおけ", "title"]);
    });
  });

  describe("calculateScore", () => {
    const q = "ray";
    const nq = normalize(q);
    const tokens = getTokens(nq);

    it("gives 100 for perfect match", () => {
      expect(calculateScore("ray", "ray", ["ray"])).toBeGreaterThanOrEqual(100);
    });

    it("gives 80 for startsWith match", () => {
      const score = calculateScore("ray of light", nq, tokens);
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it("gives 60 for includes match", () => {
      const score = calculateScore("some ray here", nq, tokens);
      expect(score).toBeGreaterThanOrEqual(60);
    });

    it("adds bonus for tokens", () => {
      const scoreWithoutBonus = calculateScore("ray", nq, []);
      const scoreWithBonus = calculateScore("ray", nq, ["ray"]);
      expect(scoreWithBonus).toBeGreaterThan(scoreWithoutBonus);
    });

    it("returns 0 for no match", () => {
      expect(calculateScore("completely different", nq, tokens)).toBe(0);
    });

    it("requires multiple tokens if no primary match", () => {
      const complexNq = "きゅうくらりん からおけ";
      const complexTokens = getTokens(complexNq);
      // Only one token match and no primary match -> 0
      expect(calculateScore("きゅうくらりん", complexNq, complexTokens)).toBe(0);
      // Two tokens match -> score based on tokens
      expect(calculateScore("きゅうくらりん からおけ モデル", complexNq, complexTokens)).toBeGreaterThan(0);
    });
  });
});
