export interface CategoryIconCardProps {
  /** Category name below the illustration. */
  label: string;
  /** Category illustration, rendered at ~96px square. */
  image?: string;
  imageNote?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function CategoryIconCard(props: CategoryIconCardProps): JSX.Element;
