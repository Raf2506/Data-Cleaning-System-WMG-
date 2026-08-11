export interface MemberBenefitCardProps {
  /** 24px heading set in canvas over dark photography. */
  headline: string;
  cta?: string;
  /** "4/5" in the membership 3-up grid. */
  ratio?: string;
  image?: string;
  imageNote?: string;
  tone?: "ink" | "soft" | string;
  style?: React.CSSProperties;
}
export function MemberBenefitCard(props: MemberBenefitCardProps): JSX.Element;
