export interface FilterChipProps {
  children?: React.ReactNode;
  /** Selected chips flip fully inverted — ink fill, canvas text. There is no middle state. */
  active?: boolean;
  /** Result count rendered in parentheses. */
  count?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function FilterChip(props: FilterChipProps): JSX.Element;
