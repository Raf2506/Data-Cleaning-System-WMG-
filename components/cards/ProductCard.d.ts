export interface ProductCardProps {
  name: string;
  /** Category subtitle — "Men's Trail Running Shoes". */
  category?: string;
  price: string;
  wasPrice?: string;
  discount?: string;
  /** Promo pill on the image, top-left. */
  badge?: string;
  /** Colorway swatch fills, 3–6 dots. */
  colors?: string[];
  /** "4 Colours" line under the category. */
  colorCount?: string;
  image?: string;
  /** Caption for the placeholder state when no image is supplied. */
  imageNote?: string;
  /** "1/1" or "4/5" for tall crops. */
  ratio?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function ProductCard(props: ProductCardProps): JSX.Element;
