import { Routes } from '@angular/router';
import { ManageMembers } from '@domains/members/features';

export const MemberRoutes: Routes = [
  {
    path: '',
    component: ManageMembers,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
