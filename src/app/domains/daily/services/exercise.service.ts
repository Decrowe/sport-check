import { computed, Injectable, signal } from '@angular/core';
import { AddExercise, Exercise, ExerciseState } from '@domains/daily/enteties';
import { deepClone } from '@shared';

const mockExercises: Exercise[] = [
  { id: 1, name: 'Squats', target: 100, unit: 'repeatitions' },
  { id: 2, name: 'Push Ups', target: 100, unit: 'repeatitions' },
  { id: 3, name: 'Plank', target: 100, unit: 'seconds' },
];

const MockStates: ExerciseState[] = [
  { exerciseId: 1, memberId: 1, progress: 10, date: new Date() },
  { exerciseId: 1, memberId: 2, progress: 20, date: new Date() },
  { exerciseId: 2, memberId: 1, progress: 30, date: new Date() },
  { exerciseId: 2, memberId: 2, progress: 40, date: new Date() },
  { exerciseId: 3, memberId: 1, progress: 50, date: new Date() },
  { exerciseId: 3, memberId: 2, progress: 60, date: new Date() },
];

@Injectable({
  providedIn: 'root',
})
export class ExersiceService {
  private _exercises = signal<Exercise[]>(mockExercises);
  readonly exercises = computed(() => deepClone(this._exercises()));

  private _exerciseStates = signal<ExerciseState[]>(MockStates);
  readonly exerciseStates = computed(() => deepClone(this._exerciseStates()));

  constructor() {}

  private getExercises() {}
  private updateExercise() {}
  private deleteExercise() {}
  private createExercise() {}

  setStateProgress(exerciseId: number, memberId: number, progress: number): void {
    this._exerciseStates.update((states) =>
      states.map((s) =>
        s.exerciseId === exerciseId && s.memberId === memberId ? { ...s, progress } : s
      )
    );
  }
  addExercise(config: AddExercise): void {
    const exercise: Exercise = {
      id: Math.max(0, ...this._exercises().map((e) => e.id)) + 1,
      ...config,
    };
    this._exercises.update((exercises) => [...exercises, exercise]);
  }
  editExercise(update: Exercise): void {
    this._exercises.update((exercises) =>
      exercises.map((exercise) => (exercise.id === update.id ? update : exercise))
    );
  }
  removeExercise(removeId: number): void {
    this._exercises.update((exercises) => exercises.filter((exercise) => exercise.id !== removeId));
    this._exerciseStates.update((states) =>
      states.filter((state) => state.exerciseId !== removeId)
    );
  }
}
