export interface PrimaryNavProps {
  /** Brand wordmark at the left. No logo file ships with this system — the name is set in the display face. */
  brand?: string;
  /** Centred nav labels. */
  items?: string[];
  /** The active label gets a 2px ink underline — no background fill. */
  active?: string;
  onNavigate?: (item: string) => void;
  style?: React.CSSProperties;
}
export function PrimaryNav(props: PrimaryNavProps): JSX.Element;
