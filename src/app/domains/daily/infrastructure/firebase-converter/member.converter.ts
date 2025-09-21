import { Exercise } from '@domains/daily/enteties';
import { FirestoreDataConverter } from '@firebase/firestore';

export const MemmberConverter: FirestoreDataConverter<Exercise> = {
  toFirestore: (exercise) => exercise,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data['name'],
      target: +data['target'],
      unit: data['unit'].toString() === 'seconds' ? 'seconds' : 'repeatitions',
    } as Exercise;
  },
};
