export type SideNavItem = {
  label: string;
  route: string;
  icon?: string;
  children?: SideNavItem[];
};
