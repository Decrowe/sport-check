import { inject, Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from '@firebase/firestore';
import { FirebaseService } from '@shared';
import { Exercise } from '../models';
import { ExerciseConverter } from './firebase-converter';

@Injectable({ providedIn: 'root' })
export class ExerciseDataService {
  private fire = inject(FirebaseService);
  private store = this.fire.store;

  private readonly collectionName = 'exercises';

  getExercises(): Promise<Exercise[]> {
    const exerciseDB = collection(this.store, this.collectionName).withConverter(ExerciseConverter);
    const exerciseSnapshot = getDocs(exerciseDB);

    return exerciseSnapshot.then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data());
    });
  }

  getExercise(id: string): Promise<Exercise> {
    const exerciseDoc = doc(this.store, this.collectionName, id).withConverter(ExerciseConverter);
    return getDoc(exerciseDoc).then((doc) => {
      const exercise = doc.data();
      if (!exercise) throw new Error('Exercise not found');
      return exercise;
    });
  }

  setExercise(exercise: Exercise): Promise<Exercise> {
    return setDoc(doc(this.store, this.collectionName, exercise.id), exercise).then(() => exercise);
  }

  deleteExercise(exerciseId: string): Promise<void> {
    return deleteDoc(doc(this.store, this.collectionName, exerciseId));
  }
}
