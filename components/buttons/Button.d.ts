/**
 * The system's pill CTA. One primary per viewport.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = ink pill (one per viewport) · secondary = soft-cloud pill · onImage = white pill on photography */
  variant?: "primary" | "secondary" | "onImage";
  /** lg = 24px campaign CTA inside hero blocks · md = standard 48px pill · sm = compact 40px pill */
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Render as "a" for link CTAs. */
  as?: "button" | "a";
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
