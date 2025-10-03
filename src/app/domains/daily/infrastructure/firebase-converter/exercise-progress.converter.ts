import { ExerciseProgress } from '@domains/daily/enteties';
import { FirestoreDataConverter } from '@firebase/firestore';

export const ExerciseProgressConverter: FirestoreDataConverter<ExerciseProgress> = {
  toFirestore: (exercise) => exercise,
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    const exerciseProgress: ExerciseProgress = {
      id: snapshot.id,
      exerciseId: data['exerciseId'],
      memberId: data['memberId'],
      progress: +data['progress'],
      date: data['date'].toDate(),
    };

    return exerciseProgress;
  },
};
