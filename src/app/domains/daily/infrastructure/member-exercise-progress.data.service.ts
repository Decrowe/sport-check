import { inject, Injectable } from '@angular/core';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { FirebaseService } from '@shared';
import {
  buildMemberExerciseProgressId,
  MemberExerciseProgress,
} from '../models/member-exercise-progress';
import { MemberExerciseProgressConverter } from './firebase-converter';

@Injectable({ providedIn: 'root' })
export class MemberExerciseProgressDataService {
  private fire = inject(FirebaseService);
  private store = this.fire.store;

  private readonly collectionName = 'member_exercises';

  async getMemberProgress(
    memberId: string,
    date: string
  ): Promise<MemberExerciseProgress | undefined> {
    const id = buildMemberExerciseProgressId(memberId, date);
    const ref = doc(this.store, this.collectionName, id).withConverter(
      MemberExerciseProgressConverter
    );
    const snap = await getDoc(ref);
    if (!snap.exists()) return undefined;
    return snap.data();
  }

  async setMemberProgress(progress: MemberExerciseProgress): Promise<MemberExerciseProgress> {
    const id = buildMemberExerciseProgressId(progress.memberId, progress.date);
    const ref = doc(this.store, this.collectionName, id);
    await setDoc(ref, progress);
    return progress;
  }
}
