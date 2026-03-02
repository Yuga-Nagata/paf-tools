/**
 * @file songs/page.tsx
 * @description Song Searcher tool page. 
 * This page serves as the dedicated entry point for searching YouTube karaoke videos.
 * It primarily mounts the `SearchUI` component.
 */

import SearchUI from "@/components/SearchUI";
export default function Home(): React.JSX.Element {
  return <SearchUI />;
}
