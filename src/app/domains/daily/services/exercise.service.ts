import { computed, inject, Injectable, signal } from '@angular/core';
import { AddExercise, Exercise, Progress } from '@domains/daily/enteties';
import { ExerciseConverter, ExerciseProgressConverter } from '@domains/daily/infrastructure';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from '@firebase/firestore';
import { deepClone, FirebaseService } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { BuildExerciseProgressId } from '../shared';

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
  readonly progressEditEnabled = computed(
    () => this._date().toDateString() === new Date().toDateString()
  );

  private _exercises = signal<Exercise[]>([]);
  readonly exercises = computed(() => deepClone(this._exercises()));

  private _progresses = signal<Progress[]>([]);
  readonly todaysExerciseProgresses = computed(() =>
    deepClone(
      this._progresses().filter(({ date }) => {
        const d = date instanceof Timestamp ? date.toDate() : date;
        return (
          d.getFullYear() === this._date().getFullYear() &&
          d.getMonth() === this._date().getMonth() &&
          d.getDate() === this._date().getDate()
        );
      })
    )
  );

  private _loadedProgresses = signal(false);
  readonly loadedProgresses = this._loadedProgresses.asReadonly();

  constructor() {
    this.getExercises();
    this.getExerciseProgresses(this._date());
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
  private createExercise(exercise: Exercise): Promise<Exercise> {
    return setDoc(doc(this.db, 'daily_exercises', exercise.id), exercise).then(() => exercise);
  }
  private updateExercise(exercise: Exercise): Promise<void> {
    return setDoc(doc(this.db, 'daily_exercises', exercise.id), exercise);
  }
  private deleteExercise(exerciseId: string): Promise<void> {
    return deleteDoc(doc(this.db, 'daily_exercises', exerciseId));
  }

  private getExerciseProgresses(date: Date) {
    const exerciseDB = collection(this.db, 'daily_exercise-progresses').withConverter(
      ExerciseProgressConverter
    );
    // Query for all progresses within the selected day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const q = query(
      exerciseDB,
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<=', Timestamp.fromDate(end))
    );
    const exerciseProgressSnapshot = getDocs(q);

    exerciseProgressSnapshot.then((snapshot) => {
      const exerciseProgress: Progress[] = [];
      snapshot.forEach((doc) => {
        exerciseProgress.push(doc.data() as Progress);
      });
      this._progresses.set(exerciseProgress);
      this._loadedProgresses.set(true);
    });
  }
  private createExerciseProgresses(progresses: Progress[]): Promise<Progress[]> {
    const promises = progresses.map((progress) =>
      setDoc(doc(this.db, 'daily_exercise-progresses', progress.id), progress).then(() => progress)
    );
    return Promise.all(promises);
  }
  private updateExerciseProgress(progress: Progress): Promise<Progress> {
    return setDoc(doc(this.db, 'daily_exercise-progresses', progress.id), progress).then(
      () => progress
    );
  }
  setDate(date: Date) {
    this._date.set(date);
    this._loadedProgresses.set(false);
    this.getExerciseProgresses(date);
  }

  initExerciseProgresses = (memberIds: string[]): void => {
    const progresses: Progress[] = [];
    memberIds.forEach((memberId) => {
      this._exercises().forEach((exercise) => {
        const progress: Progress = {
          id: BuildExerciseProgressId(exercise.id, memberId, this._date()),
          exerciseId: exercise.id,
          memberId,
          progress: 0,
          date: Timestamp.fromDate(this._date()),
        };
        progresses.push(progress);
      });
    });

    this.createExerciseProgresses(progresses).then((createdProgresses) => {
      this._progresses.update((existingProgresses) => [
        ...existingProgresses,
        ...createdProgresses,
      ]);
    });
  };

  setExerciseProgress(exerciseId: string, memberId: string, progress: number): void {
    this.updateExerciseProgress({
      exerciseId,
      memberId,
      progress,
      date: Timestamp.fromDate(this._date()),
      id: BuildExerciseProgressId(exerciseId, memberId, this._date()),
    }).then(() => {
      this._progresses.update((progresses) =>
        progresses.map((s) =>
          s.exerciseId === exerciseId && s.memberId === memberId ? { ...s, progress } : s
        )
      );
    });
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
      this._progresses.update((progresses) =>
        progresses.filter((progress) => progress.exerciseId !== removeId)
      );
    });
  }
}
