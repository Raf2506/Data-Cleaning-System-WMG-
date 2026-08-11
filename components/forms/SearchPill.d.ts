export interface SearchPillProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Pixel or CSS width. 240 in the nav cluster, "100%" in the mobile overlay. */
  width?: number | string;
  style?: React.CSSProperties;
}
export function SearchPill(props: SearchPillProps): JSX.Element;
