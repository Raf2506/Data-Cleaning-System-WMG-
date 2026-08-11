export interface IconButtonProps {
  /** Lucide icon name. */
  name: string;
  /** Accessible label — required, the button has no visible text. */
  label: string;
  /** Box size in px. 40 is the system default. */
  size?: number;
  iconSize?: number;
  /** soft = soft-cloud circle · ghost = transparent · onImage = white on photography · inverse = ink */
  variant?: "soft" | "ghost" | "onImage" | "inverse";
  style?: React.CSSProperties;
}
export function IconButton(props: IconButtonProps): JSX.Element;
