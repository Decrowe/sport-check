import { computed, Injectable, signal } from '@angular/core';
import { Member } from '@domains/daily/enteties';
import { deepClone } from '@shared';

const MockMembers: Member[] = [
  { id: 1, name: 'Lukas' },
  { id: 2, name: 'Jonas' },
];

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private _members = signal<Member[]>(MockMembers);
  readonly members = computed(() => deepClone(this._members()));
}
