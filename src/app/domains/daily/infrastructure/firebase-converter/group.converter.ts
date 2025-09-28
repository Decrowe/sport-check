import { FirestoreDataConverter } from '@firebase/firestore';
import { Group } from '../../models';
export const GroupConverter: FirestoreDataConverter<Group> = {
  toFirestore: (group: Group) => {
    return { ...group };
  },
  fromFirestore: (snapshot) => {
    const data: any = snapshot.data();
    if (!data.ownerId) {
      data.ownerId = 'unknown';
    }
    return { id: snapshot.id, ...data } as Group;
  },
};
