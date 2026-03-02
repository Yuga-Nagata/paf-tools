"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";

/**
 * Theme Registry Client Component.
 * Wraps the application with MUI theme providers and CSS baseline.
 * Essential for resolving Next.js serialization issues with MUI themes.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Application children.
 * @returns {React.JSX.Element} The theme-wrapped component tree.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
