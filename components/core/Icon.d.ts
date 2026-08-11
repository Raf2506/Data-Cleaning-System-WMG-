export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "search", "chevron-down", "heart"). */
  name: string;
  /** Pixel box. 20 for inline UI, 24 in nav clusters. */
  size?: number;
  /** Stroke color. Defaults to currentColor. */
  color?: string;
  /** Lucide stroke width; keep at 2. */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
