import { computed, inject, Injectable } from '@angular/core';
import { ExerciseKernal } from '@shared';
import { ExerciseService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ExerciseAPIService {
  private exersiseService = inject(ExerciseService);

  exercises = computed(() =>
    this.exersiseService.exercises().map(({ id, name, unit }) => {
      const kernal: ExerciseKernal = { id, name, unit };
      return kernal;
    })
  );

  loadExercises() {
    this.exersiseService.loadExercises();
  }
}
