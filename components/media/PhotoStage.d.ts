export interface PhotoStageProps {
  /** Image URL. Omit to render the soft-cloud studio backdrop with a caption. */
  src?: string;
  alt?: string;
  /** CSS aspect-ratio: "1/1" product, "4/5" tall crop or rail tile, "16/9" hero. */
  ratio?: string;
  /** Caption shown in the placeholder state, naming the shot that belongs here. */
  note?: string;
  /** Backdrop when no src: soft (the studio gray), ink, pale, or any CSS color. */
  tone?: "soft" | "ink" | "pale" | string;
  /** Overlaid content — badges, on-image CTAs, display lockups. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PhotoStage(props: PhotoStageProps): JSX.Element;
