export interface FilterGroup {
  title: string;
  options: { label: string; count?: number }[];
}
export interface FilterSidebarProps {
  groups?: FilterGroup[];
  /** Labels currently applied — these get a 1px ink underline. */
  selected?: string[];
  onToggle?: (label: string) => void;
  /** 220px fixed rail at desktop. */
  width?: number | string;
  style?: React.CSSProperties;
}
export function FilterSidebar(props: FilterSidebarProps): JSX.Element;
