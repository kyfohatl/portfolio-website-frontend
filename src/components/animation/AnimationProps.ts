import { CSSProperties } from "react";

export default interface AnimationProps {
  onAnimationEnd?: () => void,
  overrides?: Record<string, CSSProperties>
}