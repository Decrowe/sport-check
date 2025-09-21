import { Member } from '@domains/members/enteties';
import { FirestoreDataConverter } from '@firebase/firestore';

export const MemberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member) => member,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data['name'],
    } as Member;
  },
};
