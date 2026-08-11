export interface PriceRowProps {
  /** Current price, formatted with currency. */
  price: string;
  /** Original price — supplying it switches the row to sale styling. */
  wasPrice?: string;
  /** "25% off" copy, rendered in sale red. */
  discount?: string;
  /** md = product card · lg = PDP price block */
  size?: "md" | "lg";
  style?: React.CSSProperties;
}
export function PriceRow(props: PriceRowProps): JSX.Element;
