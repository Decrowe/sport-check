import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@shared/authentication';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  private loginService = inject(LoginService);
  readonly user = this.loginService.user;

  constructor() {
    effect(() => {
      if (this.user()) {
        document.title = `Sports Check - ${this.user()!.name}`;
        this.router.navigateByUrl('');
      } else {
        document.title = 'Sports Check';
        this.router.navigateByUrl('/login');
      }
    });
  }
}
