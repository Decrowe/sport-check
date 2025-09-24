import { computed, Injectable, signal } from '@angular/core';
import { deepClone, User } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _user = signal<User | undefined>(undefined);
  readonly user = computed(() => (this._user() ? deepClone(this._user()) : undefined));

  constructor() {
    const stored = localStorage.getItem('username');
    this._user.set(stored ? { name: stored } : undefined);
  }

  login(user: User) {
    this._user.set(user);
    localStorage.setItem('username', user.name);
  }

  logout() {
    this._user.set(undefined);
    localStorage.removeItem('username');
  }
}
