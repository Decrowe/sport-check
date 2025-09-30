import { FirestoreDataConverter } from '@firebase/firestore';
import { MemberExerciseProgress } from '../../models/member-exercise-progress';

export const MemberExerciseProgressConverter: FirestoreDataConverter<MemberExerciseProgress> = {
  toFirestore: (p) => ({ ...p }),
  fromFirestore: (snapshot) => {
    const data: any = snapshot.data();
    return {
      memberId: data.memberId,
      date: data.date,
      exercises: Array.isArray(data.exercises)
        ? data.exercises.map((e: any) => ({ id: e.id, amount: Number(e.amount) || 0 }))
        : [],
    } as MemberExerciseProgress;
  },
};
