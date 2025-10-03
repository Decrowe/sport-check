import { computed, inject, Injectable, signal } from '@angular/core';
import { deepClone, MemberKernal } from '@shared';
import { AuthService } from '../auth.service';

const MemberIdKey = 'memberId';
const MemberNameKey = 'memberName';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private auth = inject(AuthService);

  private _member = signal<MemberKernal | undefined>(undefined);
  readonly member = computed(() => (this._member() ? deepClone(this._member()) : undefined));

  readonly initializing = signal(true);
  readonly authenticated = computed(() => !!this._member());

  constructor() {
    let storedId: string | null = null;
    let storedName: string | null = null;

    try {
      storedId = localStorage.getItem(MemberIdKey);
      storedName = localStorage.getItem(MemberNameKey);
    } catch (e) {
      console.error(e);
    }

    const candidate =
      storedId && storedName ? { username: storedId, displayName: storedName } : undefined;
    if (candidate) {
      // Fire async verification; don't block constructor.
      this.auth
        .verifyExistingUser(candidate.username)
        .then((exists) => {
          if (exists) {
            this._member.set(candidate);
          } else {
            this.clearLocal();
          }
        })
        .finally(() => this.initializing.set(false));
    } else {
      this.initializing.set(false);
    }
  }

  login(member: MemberKernal) {
    this._member.set(member);

    try {
      localStorage.setItem(MemberNameKey, member.displayName);
      localStorage.setItem(MemberIdKey, member.username);
    } catch (e) {
      console.error(e);
    }
  }
  async loginWithPassword(
    username: string,
    password: string
  ): Promise<{ ok: true } | { error: string }> {
    const result = await this.auth.authenticate(username, password);
    if ('error' in result) return { error: result.error };
    this.login(result.member);
    return { ok: true };
  }

  async register(username: string, password: string): Promise<{ ok: true } | { error: string }> {
    const result = await this.auth.register(username, password);
    if ('error' in result) return { error: result.error };
    // Auto-login after successful registration
    this.login(result.member);
    return { ok: true };
  }
  logout() {
    this._member.set(undefined);
    try {
      localStorage.removeItem(MemberIdKey);
      localStorage.removeItem(MemberNameKey);
    } catch (e) {
      console.error(e);
    }
  }

  private clearLocal() {
    try {
      localStorage.removeItem(MemberIdKey);
      localStorage.removeItem(MemberNameKey);
    } catch (e) {
      console.error(e);
    }
  }
}
