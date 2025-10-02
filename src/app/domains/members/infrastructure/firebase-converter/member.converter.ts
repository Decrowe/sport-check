import { FirestoreDataConverter } from '@firebase/firestore';
import { Member } from '../../models';
export interface AuthRecord {
  username: string; // normalized lowercase (lookup key)
  displayName: string; // original casing as provided at registration
  salt: string; // per-user salt
  hash: string; // salted+peppered hash
  createdAt: number;
}
export const MemberConverter: FirestoreDataConverter<Member> = {
  toFirestore: (member) => member,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    const name = data['displayName'] ?? data['name'] ?? 'unknown';

    return {
      username: snapshot.id,
      displayName: name,
    };
  },
};
