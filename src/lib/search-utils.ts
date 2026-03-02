/**
 * @file search-utils.ts
 * @description Normalization and scoring algorithms for video search.
 * This file contains the core logic for fuzzy Japanese search, utilizing `wanakana`
 * for phonetic normalization (Convert to Hiragana) and a multi-tiered scoring system.
 * AI assistants should pay attention to the `normalize` function as it's critical for 
 * consistent search behavior.
 */

import * as wanakana from "wanakana";

/**
 * Normalizes a string for consistent comparison.
 * - Converts full-width alphanumeric to half-width.
 * - Converts all alphabetical characters to lowercase.
 * - Converts all Katakana to Hiragana for uniform Japanese search.
 * - Replaces common Japanese and English symbols with single spaces.
 * - Collapses multiple spaces and trims whitespace.
 * 
 * @param {string} str - The input string (e.g., video title or search query).
 * @returns {string} The normalized, lowercased, Hiragana-based string.
 */
export function normalize(str: string): string {
  // Full-width to half-width (FF01-FF5E to 0021-007E)
  let res = str.replace(/[！-～]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
  // Symbols to spaces (includes Japanese brackets and common punctuation)
  res = res.replace(/[／｜|・()\[\]【】「」'"!?,.:：/;；…\-＿_/#/＆&、。]/g, " ");
  // Convert Katakana to Hiragana for fuzzy match (e.g., 'ドライ' -> 'どらい')
  // We apply this to the whole string, but wanakana might mangle English.
  // A better way is to only target Katakana blocks, or use toHiragana with passRomaji: true
  res = wanakana.toHiragana(res, { passRomaji: true });
  // Lowercase Alphabet
  res = res.toLowerCase();
  // Collapse multiple spaces into one and trim
  res = res.replace(/\s+/g, " ").trim();
  return res;
}

/**
 * Extracts distinct tokens from a normalized query string.
 * Filters out tokens shorter than 2 characters to reduce noise.
 * 
 * @param {string} nq - A normalized query string.
 * @returns {string[]} An array of tokens with length >= 2.
 */
export function getTokens(nq: string): string[] {
  return nq.split(" ").filter((t) => t.length > 1);
}

/**
 * Calculates a relevance score for a video against a search query.
 * 
 * Scoring algorithm:
 * - Base match (checked against original title):
 *   - Perfect match: 100 points
 *   - Starts with query: 80 points
 *   - Contains query: 60 points
 * - Bonus:
 *   - +10 points for each matching token (capped at +40 points).
 * 
 * @param {string} nt - Normalized title string.
 * @param {string} nq - Normalized query string (Hiragana).
 * @param {string[]} tokens - Extracted tokens from the query.
 * @returns {number} The final calculated score (0-140). Returns 0 if no match condition is met.
 */
export function calculateScore(nt: string, nq: string, tokens: string[]): number {
  let baseScore = 0;
  
  // Check against title
  if (nt === nq) baseScore = 100;
  else if (nt.startsWith(nq)) baseScore = 80;
  else if (nt.includes(nq)) baseScore = 60;
  
  // Token match check if no primary match or for bonus calculation
  const matchingTokens = tokens.filter((t) => nt.includes(t));
  const tokenHitCount = matchingTokens.length;

  if (baseScore === 0) {
    // If no primary match, require at least 2 tokens to avoid false positives
    if (tokenHitCount < 2) return 0;
  }

  // Add bonus for matching tokens (max +40)
  return baseScore + Math.min(tokenHitCount * 10, 40);
}
