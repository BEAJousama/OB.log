/**
 * Theme for the intro overlay before React ThemeProvider hydrates.
 * Matches `theme` localStorage + system preference when unset.
 */
export function getIntroTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  try {
    const t = localStorage.getItem("theme")
    if (t === "light") return "light"
    if (t === "dark") return "dark"
  } catch {
    /* private mode */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}
