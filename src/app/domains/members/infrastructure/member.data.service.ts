import { inject, Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@firebase/firestore';
import { FirebaseService } from '@shared';
import { Member } from '../models';
import { MemberConverter } from './firebase-converter';

@Injectable({ providedIn: 'root' })
export class MemberDataService {
  private fire = inject(FirebaseService);
  private store = this.fire.store;

  private readonly collectionName = 'members';

  getMembers(): Promise<Member[]> {
    const memberDB = collection(this.store, this.collectionName).withConverter(MemberConverter);
    const memberSnapshot = getDocs(memberDB);

    return memberSnapshot.then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data());
    });
  }

  getMember(id: string): Promise<Member> {
    const memberDoc = doc(this.store, this.collectionName, id).withConverter(MemberConverter);
    return getDoc(memberDoc).then((doc) => {
      const member = doc.data();
      if (!member) throw new Error('Member not found');

      return member;
    });
  }

  setMember(member: Member): Promise<Member> {
    return updateDoc(doc(this.store, this.collectionName, member.username), member).then(
      () => member
    );
  }

  deleteMember(memberId: string): Promise<void> {
    return deleteDoc(doc(this.store, this.collectionName, memberId));
  }
}
