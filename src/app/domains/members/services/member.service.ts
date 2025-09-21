import { computed, inject, Injectable, signal } from '@angular/core';
import { MemberConverter } from '@domains/members/infrastructure';
import { collection, deleteDoc, doc, getDocs, setDoc } from '@firebase/firestore';
import { deepClone, FirebaseService } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '../enteties';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private fire = inject(FirebaseService);
  private db = this.fire.store;

  private _members = signal<Member[]>([]);
  readonly members = computed(() => deepClone(this._members()));

  constructor() {
    this.getMembers();
  }

  private getMembers() {
    const memberDB = collection(this.db, 'members').withConverter(MemberConverter);
    const memberSnapshot = getDocs(memberDB);

    memberSnapshot.then((snapshot) => {
      const members: Member[] = [];
      snapshot.forEach((doc) => {
        members.push(doc.data() as Member);
      });
      this._members.set(members);
    });
  }
  private createMember(member: Member): Promise<Member> {
    return setDoc(doc(this.db, 'members', member.id), member).then(() => member);
  }
  private updateMember(member: Member): Promise<void> {
    return setDoc(doc(this.db, 'members', member.id), member);
  }
  private deleteMember(memberId: string): Promise<void> {
    return deleteDoc(doc(this.db, 'members', memberId));
  }

  addMember(member: { name: string }) {
    const id = uuidv4();
    this.createMember({ id, name: member.name }).then(() => {
      this._members.update((members) => [...members, { id, name: member.name }]);
    });
  }

  editMember(member: { id: string; name: string }) {
    this.updateMember(member).then(() => {
      this._members.update((members) =>
        members.map((m) => (m.id === member.id ? { ...m, name: member.name } : m))
      );
    });
  }

  removeMember(id: string) {
    this.deleteMember(id).then(() => {
      this._members.update((members) => members.filter((m) => m.id !== id));
    });
  }
}
