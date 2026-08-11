export interface FooterColumn {
  title: string;
  links: string[];
}
export interface FooterProps {
  /** Four columns in the standard layout: Resources / Help / Company / Promotions & Discounts. */
  columns?: FooterColumn[];
  /** 9px fine-print row — copyright, locale, terms, privacy, supply-chain act. */
  fineprint?: string[];
  style?: React.CSSProperties;
}
export function Footer(props: FooterProps): JSX.Element;
