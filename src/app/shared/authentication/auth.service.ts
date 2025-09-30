import { inject, Injectable } from '@angular/core';
import { collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { FirebaseService, MemberKernal } from '@shared';
import { hashPassword, randomSalt, verifyPassword } from './hash.util';
import { MemberRecord } from './member.record';

// Firestore collection name for auth records
const AUTH_COLLECTION = 'members';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private fire = inject(FirebaseService);
  private store = this.fire.store;

  private normalize(username: string) {
    return username.trim().toLowerCase();
  }

  private userDocRef(username: string) {
    const normalizedName = this.normalize(username);
    return doc(collection(this.store, AUTH_COLLECTION), normalizedName);
  }

  async register(
    username: string,
    password: string
  ): Promise<{ member: MemberKernal } | { error: string }> {
    const normalizedName = this.normalize(username);
    if (!normalizedName) return { error: 'Username required' };
    if (!password) return { error: 'Password required' };

    const ref = this.userDocRef(normalizedName);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return { error: 'User already exists' };
    }

    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    const record: MemberRecord = {
      username: normalizedName,
      displayName: username, // preserve original casing
      salt,
      hash,
      createdAt: Date.now(),
    };
    await setDoc(ref, record);

    // For primitive auth, we reuse username as id.
    return { member: { username: normalizedName, displayName: username } };
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<{ member: MemberKernal } | { error: string }> {
    const normalizedName = this.normalize(username);
    const doc = this.userDocRef(normalizedName);
    const snapshot = await getDoc(doc);
    if (!snapshot.exists()) return { error: 'Invalid credentials' };
    const data = snapshot.data() as MemberRecord | (MemberRecord & { displayName?: string });
    const ok = await verifyPassword(password, data.salt, data.hash);
    if (!ok) return { error: 'Invalid credentials' };
    // Prefer stored original casing if present; fallback to provided input
    const display = (data as any).displayName || username;
    return { member: { username: normalizedName, displayName: display } };
  }

  async verifyExistingUser(username: string): Promise<boolean> {
    const normalizedName = this.normalize(username);
    if (!normalizedName) return false;
    const ref = this.userDocRef(normalizedName);
    const snapshot = await getDoc(ref);
    return snapshot.exists();
  }
}
