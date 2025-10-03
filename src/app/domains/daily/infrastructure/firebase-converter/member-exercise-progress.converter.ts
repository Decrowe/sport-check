import { FirestoreDataConverter } from '@firebase/firestore';
import { MemberExerciseProgress } from '../../models/member-exercise-progress';

export const MemberExerciseProgressConverter: FirestoreDataConverter<MemberExerciseProgress> = {
  toFirestore: (p) => ({ ...p }),
  fromFirestore: (snapshot) => {
    const data: any = snapshot.data();
    const memberProgress: MemberExerciseProgress = {
      memberId: data.memberId,
      date: data.date,
      progresses: Array.isArray(data.progresses)
        ? data.progresses.map((e: any) => ({ id: e.id, progress: e.progress ?? 0 }))
        : [],
    };

    return memberProgress;
  },
};
