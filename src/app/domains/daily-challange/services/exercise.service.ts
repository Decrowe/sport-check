import { computed, Injectable, signal } from '@angular/core';
import { AddExercise, Exercise, ExerciseState } from '@domains/daily-challange/enteties';
import { deepClone } from '@shared';

const mockExercises: Exercise[] = [
  { id: 1, name: 'Squats', target: 100, unit: 'repeatitions' },
  { id: 2, name: 'Push Ups', target: 100, unit: 'repeatitions' },
  { id: 3, name: 'Plank', target: 100, unit: 'seconds' },
];

const mockExerciseStates: ExerciseState[] = [
  { exerciseId: 1, memberId: 1, completed: false, date: new Date() },
  { exerciseId: 1, memberId: 2, completed: false, date: new Date() },
  { exerciseId: 2, memberId: 1, completed: false, date: new Date() },
  { exerciseId: 2, memberId: 2, completed: false, date: new Date() },
];

@Injectable({
  providedIn: 'root',
})
export class ExersiceService {
  private _exercises = signal<Exercise[]>(mockExercises);
  readonly exercises = computed(() => deepClone(this._exercises()));

  private _exerciseStates = signal<ExerciseState[]>(mockExerciseStates);
  readonly exerciseStates = computed(() => deepClone(this._exerciseStates()));

  constructor() {}

  private getExercises() {}
  private updateExercise() {}
  private deleteExercise() {}
  private createExercise() {}

  exerciseDone(exerciseId: number, memberId: number): void {
    this._exerciseStates.update((states) =>
      states.map((s) =>
        s.exerciseId === exerciseId && s.memberId === memberId ? { ...s, completed: true } : s
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
