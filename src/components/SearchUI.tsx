"use client";

/**
 * @file SearchUI.tsx
 * @description Main interactive search interface for the Song Searcher tool.
 * Handles user input, state management for fetching results, and adaptive display 
 * of dual-lane search outcomes (Global Top 10 vs Channel-grouped Top 3).
 * 
 * Use this component to provide a modern, responsive karaoke video discovery experience.
 */

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Link,
  Paper,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchResponse, SearchResult } from "@/lib/types";

/**
 * Main Search UI Component.
 * 
 * Logic Overview:
 * - Maintains local state for query, results, loading, and error.
 * - Triggers GET /api/search?q=... on submission.
 * - Handles 503 Service Unavailable as a 'Not Synced' state.
 * 
 * @returns {React.JSX.Element} The rendered search interface.
 */
export default function SearchUI(): React.JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notSynced, setNotSynced] = useState<boolean>(false);

  /**
   * Handlers search submission.
   * 
   * @param {React.FormEvent} [e] - Optional form event to prevent default behavior.
   * @returns {Promise<void>}
   */
  const handleSearch = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setNotSynced(false);

    try {
      const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
      if (res.status === 503) {
        setNotSynced(true);
        setResults(null);
      } else if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Search failed");
      } else {
        const data: SearchResponse = await res.json();
        setResults(data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        歌枠 許諾済みYouTube検索
      </Typography>

      <Box 
        component="form" 
        onSubmit={handleSearch} 
        sx={{ 
          my: 4, 
          display: "flex", 
          gap: 1,
          alignItems: "stretch",
          bgcolor: "background.paper",
          p: 0.5,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          "&:focus-within": {
            boxShadow: "0 6px 25px rgba(0,118,210,0.12)",
          }
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="曲名、アーティスト名で検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          sx={{ 
            flexGrow: 1,
            px: 2,
            "& .MuiInput-underline:before": { display: "none" },
            "& .MuiInput-underline:after": { display: "none" },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": { display: "none" },
            display: "flex",
            justifyContent: "center"
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          disabled={loading || !query.trim()}
          sx={{ 
            whiteSpace: "nowrap", 
            minWidth: "120px",
            px: 4,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,118,210,0.3)"
            }
          }}
        >
          {loading ? "検索中..." : "検索"}
        </Button>
      </Box>

      {notSynced && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          未同期です。まず同期してください（管理者向け：/api/songs/sync を POST してください）。
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Grid container spacing={4}>
          {/* Lane 1: Top 10 across all channels */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                トップ候補 (全チャンネル上位10件)
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {results.top.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  該当なし
                </Typography>
              ) : (
                <List dense>
                  {results.top.map((video) => (
                    <VideoItem key={video.videoId} video={video} showChannel />
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Lane 2: Top 3 grouped by each channel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                チャンネル別 (優先順位順)
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                {results.byChannel.map((ch) => (
                  <Box key={ch.channelId} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5", px: 1 }}>
                      {ch.channelRank}. {ch.channelLabel}
                    </Typography>
                    {ch.items.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2, py: 1 }}>
                        該当なし
                      </Typography>
                    ) : (
                      <List dense>
                        {ch.items.map((video) => (
                          <VideoItem 
                            key={video.videoId} 
                            video={{ ...video, channelLabel: ch.channelLabel, channelRank: ch.channelRank, score: 0 }} 
                          />
                        ))}
                      </List>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {results && (
        <Typography variant="caption" display="block" sx={{ mt: 4, textAlign: "right" }}>
          最終同期: {new Date(results.updatedAt).toLocaleString()}
        </Typography>
      )}
    </Container>
  );
}

/**
 * Helper component to render a single video item in a list.
 * 
 * @param {Object} props
 * @param {SearchResult} props.video - The video data to display.
 * @param {boolean} [props.showChannel] - Whether to display the channel label.
 * @returns {React.JSX.Element}
 */
function VideoItem({ video, showChannel }: { video: SearchResult; showChannel?: boolean }): React.JSX.Element {
  return (
    <ListItem
      alignItems="flex-start"
      component={Link}
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      sx={{
        textDecoration: "none",
        color: "inherit",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          src={video.thumbnailUrl}
          sx={{ width: 80, height: 45, mr: 1 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={video.title}
        secondary={
          <React.Fragment>
            {showChannel && (
              <Typography component="span" variant="caption" color="text.primary" display="block">
                {video.channelLabel}
              </Typography>
            )}
            {video.score > 0 && `Score: ${video.score}`}
          </React.Fragment>
        }
        primaryTypographyProps={{ variant: "body2", sx: { lineHeight: 1.2, mb: 0.5 } }}
      />
    </ListItem>
  );
}
