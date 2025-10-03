import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExerciseProgress } from '@domains/daily/models';
import { GroupService, ProgressService } from '@domains/daily/services';
import { ExerciseAPIService } from '@domains/exercises/API';
import { deepClone, ExerciseKernal, LoginService } from '@shared';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatBadgeModule,
    A11yModule,
  ],
  templateUrl: './exercise-bottom-sheet.component.html',
  styleUrls: ['./exercise-bottom-sheet.component.scss'],
})
export class ExerciseListComponent {
  private login = inject(LoginService);
  private progressService = inject(ProgressService);
  private exerciseAPI = inject(ExerciseAPIService);
  private groupService = inject(GroupService);
  private destroyRef = inject(DestroyRef);
  private sheetRef = inject(MatBottomSheetRef);

  readonly member = this.login.member;
  readonly exercises = signal<ExerciseKernal[]>([]);
  readonly groupExercises = computed(() =>
    this.exercises().filter((ex) => this.isEcxerciseInGroups(ex.id))
  );

  readonly todaysProgress = this.progressService.todaysProgress;

  readonly joinedGroups = this.groupService.joinedGroups;

  readonly progressMap = signal(new Map<string, number>());
  readonly nextGoalMap = signal(new Map<string, number>());

  readonly nonGroupExercisesHidden = signal(true);

  readonly exercisesGroup = new FormGroup({});

  constructor() {
    const sortEffect = effect(() => {
      //if contidtion needed since sorting relies on percentage value
      if (this.nextGoalMap()) {
        const sorted = deepClone(this.exerciseAPI.exercises()).sort(
          (a, b) => this.getNextGoalPercentage(b.id) - this.getNextGoalPercentage(a.id)
        );
        this.exercises.set(sorted);
        //Just once when data received
        sortEffect.destroy();
      }
    });

    effect(() => this.initFormGroup(this.exercises()));

    effect(() => {
      const map = new Map<string, number>();
      this.todaysProgress().forEach(({ id, progress }) => {
        map.set(id, progress);
      });

      this.progressMap.set(map);

      this.patchGroup(this.todaysProgress());
    });

    effect(() => {
      const groups = this.joinedGroups();
      const progress = this.todaysProgress();

      const goalMap = new Map<string, number>();

      if (progress.length === 0) return;

      // Build a map of all goals for each exercise
      const goalsMap = new Map<string, number[]>();
      groups.forEach((group) => {
        group.exercises.forEach(({ id, goal }) => {
          if (goal) {
            if (!goalsMap.has(id)) {
              goalsMap.set(id, []);
            }
            goalsMap.get(id)!.push(goal);
          }
        });
      });

      // For each exercise, sort goals and find the next highest or last goal
      goalsMap.forEach((goals, id) => {
        const currentProgress = this.progressMap().get(id) ?? 0;
        const sortedGoals = goals.sort((a, b) => a - b);
        // Find the next highest goal greater than current progress
        const nextGoal = sortedGoals.find((goal) => goal > currentProgress);
        // If no next goal, use the last goal (highest)
        goalMap.set(id, nextGoal ?? sortedGoals[sortedGoals.length - 1]);
      });

      this.nextGoalMap.set(goalMap);
    });
  }

  private initFormGroup(exercises: ExerciseKernal[]) {
    exercises.forEach((exercise) => {
      const control = new FormControl(this.progressMap().get(exercise.id) ?? 0, {
        nonNullable: true,
      });
      this.exercisesGroup.addControl(exercise.id, control);

      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
        .subscribe((value) => {
          this.onProgressChange(exercise.id, value);
        });
    });
  }

  private patchGroup(progress: ExerciseProgress[]) {
    progress.forEach(({ id, progress }) => {
      const control = this.getExerciseControl(id);
      if (control) control.patchValue(progress, { emitEvent: false });
    });
  }

  getGroupNamesForExerciseGoalFormatted(exerciseId: string) {
    const nextGoal = this.nextGoalMap().get(exerciseId);
    if (nextGoal == null) return '';

    // Return only the names of groups whose goal for this exercise equals the selected "next" goal
    const names = this.joinedGroups()
      .filter((group) => group.exercises.some((ex) => ex.id === exerciseId && ex.goal === nextGoal))
      .map((group) => group.name);

    return names.join(', ');
  }

  getExerciseControl(exerciseId: string) {
    return this.exercisesGroup.get(exerciseId) as FormControl<number>;
  }

  getNextGoalPercentage(exerciseId: string) {
    const nextGoal = this.nextGoalMap().get(exerciseId);
    const currentProgress = this.progressMap().get(exerciseId) ?? 0;
    if (!nextGoal) return 0;
    return Math.fround(Math.min((currentProgress / nextGoal) * 100, 100));
  }

  isEcxerciseInGroups(exerciseId: string) {
    return this.joinedGroups().some((group) =>
      group.exercises.some((exercise) => exercise.id === exerciseId)
    );
  }

  onProgressChange(exerciseId: string, amount: number) {
    const member = this.member();
    if (!member) return;
    this.progressService.setExerciseProgress(member.username, exerciseId, amount);
  }

  onProgressIncrease(exerciseId: string, increase: number) {
    this.getExerciseControl(exerciseId)?.setValue(
      (this.getExerciseControl(exerciseId)?.value ?? 0) + increase
    );
  }

  onSubmit() {
    this.sheetRef.dismiss();
  }

  onClose() {
    this.sheetRef.dismiss();
  }
}
