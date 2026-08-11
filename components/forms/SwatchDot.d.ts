export interface SwatchDotProps {
  /** The colorway's actual product color. */
  color?: string;
  /** Active adds a 2px ink outer ring with a 2px canvas interior gap. */
  active?: boolean;
  /** Accessible colorway name. */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function SwatchDot(props: SwatchDotProps): JSX.Element;
