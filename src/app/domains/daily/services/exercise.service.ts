import { v4 as uuidv4 } from 'uuid';

import { computed, inject, Injectable, signal } from '@angular/core';
import { AddExercise, Exercise, ExerciseState } from '@domains/daily/enteties';
import { ExerciseConverter } from '@domains/daily/infrastructure';
import { collection, deleteDoc, doc, getDocs, setDoc } from '@firebase/firestore';
import { deepClone, FirebaseService } from '@shared';

const MockStates: ExerciseState[] = [
  { exerciseId: '1', memberId: '1', progress: 10, date: new Date() },
  { exerciseId: '1', memberId: '2', progress: 20, date: new Date() },
  { exerciseId: '2', memberId: '1', progress: 30, date: new Date() },
  { exerciseId: '2', memberId: '2', progress: 40, date: new Date() },
  { exerciseId: '3', memberId: '1', progress: 50, date: new Date() },
  { exerciseId: '3', memberId: '2', progress: 60, date: new Date() },
];

@Injectable({
  providedIn: 'root',
})
export class ExersiceService {
  private fire = inject(FirebaseService);
  private db = this.fire.store;

  private _date = signal(new Date());
  readonly date = computed(() => {
    return deepClone(this._date());
  });

  private _exercises = signal<Exercise[]>([]);
  readonly exercises = computed(() => deepClone(this._exercises()));

  private _exerciseStates = signal<ExerciseState[]>(MockStates);
  readonly exerciseStates = computed(() => deepClone(this._exerciseStates()));
  readonly todaysExerciseStates = computed(() =>
    deepClone(
      this._exerciseStates().filter(({ date }) => date.toString() === this._date().toString())
    )
  );

  constructor() {
    this.getExercises();
  }

  private getExercises() {
    const exerciseDB = collection(this.db, 'daily_exercises').withConverter(ExerciseConverter);
    const exerciseSnapshot = getDocs(exerciseDB);

    exerciseSnapshot.then((snapshot) => {
      const exercises: Exercise[] = [];
      snapshot.forEach((doc) => {
        exercises.push(doc.data() as Exercise);
      });
      this._exercises.set(exercises);
    });
  }
  private updateExercise(exercise: Exercise): Promise<void> {
    return setDoc(doc(this.db, 'daily_exercises', exercise.id), exercise);
  }
  private deleteExercise(exerciseId: string): Promise<void> {
    return deleteDoc(doc(this.db, 'daily_exercises', exerciseId));
  }
  private createExercise(exercise: Exercise): Promise<Exercise> {
    return setDoc(doc(this.db, 'daily_exercises', exercise.id), exercise).then(() => exercise);
  }

  setDate(date: Date) {
    this._date.set(date);
  }

  setStateProgress(exerciseId: string, memberId: string, progress: number): void {
    this._exerciseStates.update((states) =>
      states.map((s) =>
        s.exerciseId === exerciseId && s.memberId === memberId ? { ...s, progress } : s
      )
    );
  }
  addExercise(config: AddExercise): void {
    const exercise: Exercise = {
      id: uuidv4(),
      ...config,
    };

    this.createExercise(exercise).then(() => {
      this._exercises.update((exercises) => [...exercises, exercise]);
    });
  }

  editExercise(update: Exercise): void {
    this.updateExercise(update).then(() => {
      this._exercises.update((exercises) =>
        exercises.map((exercise) => (exercise.id === update.id ? update : exercise))
      );
    });
  }

  removeExercise(removeId: string): void {
    this.deleteExercise(removeId).then(() => {
      this._exercises.update((exercises) =>
        exercises.filter((exercise) => exercise.id !== removeId)
      );
      this._exerciseStates.update((states) =>
        states.filter((state) => state.exerciseId !== removeId)
      );
    });
  }
}
