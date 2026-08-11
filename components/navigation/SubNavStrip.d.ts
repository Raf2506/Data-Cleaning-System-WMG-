export interface SubNavStripProps {
  /** Breadcrumb segments, joined with " / " in mute caption type. */
  breadcrumb?: string[];
  /** Current sort label. */
  sort?: string;
  filtersHidden?: boolean;
  onToggleFilters?: () => void;
  style?: React.CSSProperties;
}
export function SubNavStrip(props: SubNavStripProps): JSX.Element;
