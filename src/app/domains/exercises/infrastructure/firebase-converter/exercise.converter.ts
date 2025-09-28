import { FirestoreDataConverter } from '@firebase/firestore';
import { ExerciseUnits } from '@shared';
import { Exercise } from '../../models';

export const ExerciseConverter: FirestoreDataConverter<Exercise> = {
  toFirestore: (exercise) => exercise,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();

    let unit = data['unit'].toString();
    if (!Object.values<string>(ExerciseUnits).includes(unit)) {
      unit = ExerciseUnits.Unknown;
    }
    return {
      id: snapshot.id,
      name: data['name'],
      unit,
    } as Exercise;
  },
};
