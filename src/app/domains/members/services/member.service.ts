import { computed, inject, Injectable, signal } from '@angular/core';
import { MemberDataService } from '@domains/members/infrastructure';
import { deepClone } from '@shared';
import { Member } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private dataService = inject(MemberDataService);

  private _members = signal<Member[]>([]);
  readonly members = computed(() => deepClone(this._members()));

  constructor() {
    this.loadMembers();
  }

  loadMembers() {
    this.dataService.getMembers().then((members) => {
      this._members.set(members);
    });
  }

  private createMember(member: Member): Promise<Member> {
    return this.dataService.setMember(member);
  }

  private updateMember(member: Member): Promise<Member> {
    return this.dataService.setMember(member);
  }

  private deleteMember(memberId: string): Promise<void> {
    return this.dataService.deleteMember(memberId);
  }

  addMember(member: { displayName: string }) {
    const username = member.displayName.trim().toLowerCase();
    this.createMember({ username, displayName: member.displayName }).then(() => {
      this._members.update((members) => [
        ...members,
        { username, displayName: member.displayName },
      ]);
    });
  }

  editMember(member: { username: string; displayName: string }) {
    this.updateMember(member).then(() => {
      this._members.update((members) =>
        members.map((m) =>
          m.username === member.username ? { ...m, displayName: member.displayName } : m
        )
      );
    });
  }

  removeMember(username: string) {
    this.deleteMember(username).then(() => {
      this._members.update((members) => members.filter((m) => m.username !== username));
    });
  }
}
