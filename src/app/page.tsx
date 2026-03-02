"use client";

import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import Link from "next/link";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

/**
 * @file app/page.tsx
 * @description The main portal page for paf-tools.
 */
/**
 * Portal Page Component.
 * The central entry point for all paf-tools. Provides a high-level overview
 * and navigation to individual tools like the Song Searcher.
 * 
 * @returns {React.JSX.Element} The rendered portal home page.
 */
export default function PortalPage(): React.JSX.Element {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
        paf-tools
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        配信活動（主にIRIAM）を便利にするためのツール集
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              borderRadius: 4,
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" }
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              歌枠動画検索
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              許諾済みチャンネルの動画を曲名で高速検索します。
            </Typography>
            <Button 
              component={Link} 
              href="/songs" 
              variant="contained" 
              size="large"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              ツールを開く
            </Button>
          </Paper>
        </Grid>
        
        {/* Placeholder for future tools */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              borderRadius: 4,
              bgcolor: "grey.50",
              border: "2px dashed",
              borderColor: "grey.300"
            }}
          >
            <Box sx={{ height: 64, mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="h4" color="grey.400">?</Typography>
            </Box>
            <Typography variant="h5" component="h2" gutterBottom color="grey.500">
              Coming Soon
            </Typography>
            <Typography variant="body2" color="grey.400" align="center" sx={{ mb: 3 }}>
              新しいツールを開発中です。
            </Typography>
            <Button 
              disabled 
              variant="outlined" 
              size="large"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              準備中
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
