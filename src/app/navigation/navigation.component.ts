import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SideNavConfig } from './side-nav-config';
import { SideNavItem } from './side-nav-item';

const SideNavDailyExercises: SideNavItem = {
  label: 'Exercises',
  route: 'daily/exercises',
  icon: 'fitness_center',
};
const SideNavDailyStates: SideNavItem = {
  label: 'States',
  route: 'daily/states',
  icon: 'public',
};
const SideNavDaily: SideNavItem = {
  label: 'Daily',
  route: 'daily',
  icon: 'today',
  children: [SideNavDailyExercises, SideNavDailyStates],
};

const SideNav: SideNavConfig = {
  items: [SideNavDaily],
};

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    CommonModule,
    RouterModule,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  readonly sidenavConfig = signal<SideNavConfig>(SideNav);
}
