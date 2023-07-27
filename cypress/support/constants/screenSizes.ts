// Old method of defining screen sizes ---------------------------------------------------------------------------------
export const DESKTOP_PIXEL_WIDTH = 1500
export const MOBILE_PIXEL_WIDTH = 390
export const PIXEL_HEIGHT = 800

// New method of defining screen sizes ---------------------------------------------------------------------------------
export type ViewportName = "desktop" | "mobile"

interface ViewportDimensions {
  pixelWidth: number,
  pixelHeight: number
}

export const VIEWPORT_DIMENSIONS: Record<ViewportName, ViewportDimensions> = {
  desktop: { pixelWidth: DESKTOP_PIXEL_WIDTH, pixelHeight: PIXEL_HEIGHT },
  mobile: { pixelWidth: MOBILE_PIXEL_WIDTH, pixelHeight: PIXEL_HEIGHT }
}

export function isDesktopScreen(width: number, height: number) {
  return width === VIEWPORT_DIMENSIONS.desktop.pixelWidth && height === VIEWPORT_DIMENSIONS.desktop.pixelHeight
}

export function isMobileScreen(width: number, height: number) {
  return width === VIEWPORT_DIMENSIONS.mobile.pixelWidth && height === VIEWPORT_DIMENSIONS.mobile.pixelHeight
}