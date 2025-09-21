export type SideNavItem = {
  label: string;
  route: string;
  icon?: string;
  disabled?: boolean;
  children?: SideNavItem[];
};
