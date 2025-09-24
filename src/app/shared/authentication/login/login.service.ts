import { computed, Injectable, signal } from '@angular/core';
import { deepClone, User } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _user = signal<User | undefined>(undefined);
  readonly user = computed(() => (this._user() ? deepClone(this._user()) : undefined));

  constructor() {

    let stored: string | null = null;
    try {
      stored = localStorage.getItem('username');
    } catch (e) {
      // localStorage unavailable, ignore
    }

    this._user.set(stored ? { name: stored } : undefined);
  }

  login(user: User) {
    this._user.set(user);

    try {
      localStorage.setItem('username', user.name);
    } catch (e) {
      // localStorage unavailable, ignore
    }
  }
  logout() {
    this._user.set(undefined);
    try {
      localStorage.removeItem('username');
    } catch (e) {
      // localStorage unavailable, ignore
    }

  }
}
