import { SideNavConfig } from './side-nav-config';
import { SideNavItem } from './side-nav-item';

export const SideNavDailyExercises: SideNavItem = {
  label: 'Exercises',
  route: 'daily/exercises',
  icon: 'fitness_center',
};
export const SideNavDailyProgresses: SideNavItem = {
  label: 'Progress',
  route: 'daily/progress',
  icon: 'bolt',
};
export const SideNavDaily: SideNavItem = {
  label: 'Daily',
  route: 'daily',
  icon: 'today',
  children: [SideNavDailyExercises, SideNavDailyProgresses],
};

export const SideNavActivities: SideNavItem = {
  label: 'Activities',
  route: 'activities',
  icon: 'directions_run',
  disabled: true,
};
export const SideNavChallenges: SideNavItem = {
  label: 'Challenges',
  route: 'challenges',
  icon: 'emoji_events',
  disabled: true,
};

export const SideNavMembers: SideNavItem = {
  label: 'Members',
  route: 'members',
  icon: 'group',
};

export const config: SideNavConfig = {
  items: [SideNavDaily, SideNavActivities, SideNavChallenges, SideNavMembers],
};
