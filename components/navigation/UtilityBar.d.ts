export interface UtilityBarProps {
  /** Right-aligned utility links. Defaults to the system's standard cluster. */
  links?: string[];
  /** Optional left-side slot — locale switcher or promo line. */
  left?: React.ReactNode;
  style?: React.CSSProperties;
}
export function UtilityBar(props: UtilityBarProps): JSX.Element;
