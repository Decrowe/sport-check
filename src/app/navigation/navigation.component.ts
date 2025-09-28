import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '@shared/authentication';
import { map, shareReplay } from 'rxjs/operators';
import { config } from './configuration';
import { SideNavConfig } from './side-nav-config';
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
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatMenuModule,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private loginService = inject(LoginService);

  readonly currentMember = this.loginService.member;

  sidenavOpened = computed(() => {
    if (this.currentMember() === undefined) return false;
    return this.isHandset() === false;
  });

  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    )
  );

  readonly sidenavConfig = signal<SideNavConfig>(config);

  onLogout() {
    this.loginService.logout();
  }
}
