import { Progress } from '@domains/daily/enteties';
import { FirestoreDataConverter } from '@firebase/firestore';

export const ExerciseProgressConverter: FirestoreDataConverter<Progress> = {
  toFirestore: (exercise) => exercise,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    const exerciseProgress: Progress = {
      id: snapshot.id,
      exerciseId: data['exerciseId'],
      memberId: data['memberId'],
      progress: +data['progress'],
      date: data['date'].toDate(),
    };

    return exerciseProgress;
  },
};
