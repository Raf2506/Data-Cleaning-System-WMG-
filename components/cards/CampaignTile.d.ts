export interface CampaignTileProps {
  /** Uppercase display lockup. Keep it to a few words — it sets at 96px. */
  headline?: string;
  /** Small uppercase kicker above the headline. */
  eyebrow?: string;
  /** Label for the white on-image pill anchored bottom-left. */
  cta?: string;
  /** "16/9" desktop hero, "4/5" mobile art-direction crop, "1/1" grid tile. */
  ratio?: string;
  image?: string;
  imageNote?: string;
  /** Whichever of canvas/ink reads against the photograph — chosen per asset. */
  headlineColor?: string;
  /** Display size in px: 96 desktop, 64 tablet, 48 mobile. */
  size?: number;
  align?: "top" | "bottom";
  /** Placeholder backdrop tone when no image is supplied. */
  tone?: "ink" | "soft" | "pale" | string;
  style?: React.CSSProperties;
}
export function CampaignTile(props: CampaignTileProps): JSX.Element;
