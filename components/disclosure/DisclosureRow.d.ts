export interface DisclosureRowProps {
  /** Row label — "View Product Details", "Shipping & Returns", "Reviews (24)". */
  label: string;
  children?: React.ReactNode;
  /** detail = PDP row (body-strong) · faq = membership FAQ row (heading-md) */
  variant?: "detail" | "faq";
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}
export function DisclosureRow(props: DisclosureRowProps): JSX.Element;
