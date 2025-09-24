import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '@shared/authentication';
import { Observable } from 'rxjs';
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
    AsyncPipe,
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatMenuModule,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private loginService = inject(LoginService);

  readonly user = this.loginService.user;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  readonly sidenavConfig = signal<SideNavConfig>(config);

  onLogout() {
    this.loginService.logout();
  }
}
