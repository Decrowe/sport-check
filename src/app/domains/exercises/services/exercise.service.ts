import { computed, inject, Injectable, signal } from '@angular/core';
import { ExerciseDataService } from '@domains/exercises/infrastructure';
import { deepClone } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { AddExercise, Exercise } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private dataService = inject(ExerciseDataService);

  private _exercises = signal<Exercise[]>([]);
  readonly exercises = computed(() => deepClone(this._exercises()));

  constructor() {
    this.loadExercises();
  }

  loadExercises() {
    this.dataService.getExercises().then((exercises) => {
      this._exercises.set(exercises);
    });
  }
  private createExercise(exercise: Exercise): Promise<Exercise> {
    return this.dataService.setExercise(exercise).then(() => exercise);
  }
  private updateExercise(exercise: Exercise): Promise<Exercise> {
    return this.dataService.setExercise(exercise).then(() => exercise);
  }
  private deleteExercise(exerciseId: string): Promise<void> {
    return this.dataService.deleteExercise(exerciseId);
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
    });
  }
}
