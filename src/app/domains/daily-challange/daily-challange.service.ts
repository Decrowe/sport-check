import { Injectable, signal } from '@angular/core';
import { Exercise } from './enteties/exercise';
import { ExerciseState } from './enteties/exercise-state';
import { Member } from './enteties/member';

@Injectable({
  providedIn: 'root',
})
export class DailyChallengeService {
  constructor() {}

  private _exercises = signal<Exercise[]>([
    { id: 1, name: 'Squats', target: 100, unit: 'reps' },
    { id: 2, name: 'Push Ups', target: 100, unit: 'reps' },
    { id: 3, name: 'Plank', target: 100, unit: 'seconds' },
  ]);
  readonly exercises = this._exercises.asReadonly();

  private _members = signal<Member[]>([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]);
  readonly members = this._members.asReadonly();

  private _exerciseStates = signal<ExerciseState[]>([
    { exerciseId: 1, memberId: 1, completed: false },
    { exerciseId: 1, memberId: 2, completed: false },
    { exerciseId: 2, memberId: 1, completed: false },
    { exerciseId: 2, memberId: 2, completed: false },
  ]);
  readonly exerciseStates = this._exerciseStates.asReadonly();

  exerciseDone(exerciseId: number, memberId: number): void {
    this._exerciseStates.update((states) =>
      states.map((s) =>
        s.exerciseId === exerciseId && s.memberId === memberId ? { ...s, completed: true } : s
      )
    );
  }
}
