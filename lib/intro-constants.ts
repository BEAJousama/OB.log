/** Logo fly animation — keep in sync with `LogoFlyToHeader` and hero intro CSS */
export const LOGO_FLY_DURATION_MS = 920
export const LOGO_FLY_SETTLE_MS = 80
export const LOGO_FLY_EASING = "cubic-bezier(0.33, 1, 0.68, 1)"

/** Outer size (px): <640 → small square, else large */
export const LOADING_LOGO_PX = 200
export const LOADING_LOGO_PX_SM = 240
export const LOADING_LOGO_BREAKPOINT_PX = 640

export function getLogoStartSizePx(width: number): number {
  return width >= LOADING_LOGO_BREAKPOINT_PX ? LOADING_LOGO_PX_SM : LOADING_LOGO_PX
}

/** Hero glass card — synced to logo flight (optional home hero) */
export const HERO_CARD_INTRO_DELAY_MS = Math.round(LOGO_FLY_DURATION_MS * 0.34)
export const HERO_CARD_INTRO_DURATION_MS = Math.round(LOGO_FLY_DURATION_MS * 0.88)
export const HERO_INNER_STAGGER_AFTER_CARD_MS = 140
