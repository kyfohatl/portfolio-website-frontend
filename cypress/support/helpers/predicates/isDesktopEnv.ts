import { DESKTOP_PIXEL_WIDTH } from "../../constants/screenSizes";

export default function isDesktopEnv(win: Cypress.AUTWindow) {
  return win.innerWidth >= DESKTOP_PIXEL_WIDTH
}