import { inject, Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from '@firebase/firestore';
import { FirebaseService } from '@shared';
import { Group } from '../models';
import { GroupConverter } from './firebase-converter';

@Injectable({
  providedIn: 'root',
})
export class GroupDataService {
  private fire = inject(FirebaseService);
  private store = this.fire.store;

  private readonly collectionName = 'daily_groups';

  getGroups(): Promise<Group[]> {
    const groupDB = collection(this.store, this.collectionName).withConverter(GroupConverter);
    const groupSnapshot = getDocs(groupDB);

    return groupSnapshot.then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data());
    });
  }

  getGroup(id: string): Promise<Group> {
    const groupDoc = doc(this.store, this.collectionName, id).withConverter(GroupConverter);
    return getDoc(groupDoc).then((doc) => {
      const group = doc.data();
      if (!group) throw new Error('Group not found');
      return group;
    });
  }

  setGroup(group: Group): Promise<Group> {
    return setDoc(doc(this.store, this.collectionName, group.id), group).then(() => group);
  }

  deleteGroup(groupId: string): Promise<void> {
    return deleteDoc(doc(this.store, this.collectionName, groupId));
  }
}
