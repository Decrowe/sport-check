import { NgClass } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { Exercise, ExerciseProgress } from '@domains/daily/enteties';
import { ExersiceService } from '@domains/daily/services';
import { MemberService } from '@domains/members';
import { Member } from '@domains/members/enteties';
import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-member-states',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSliderModule,
    MatCheckboxModule,
    NgClass,
    Toolbar,
  ],
  templateUrl: './member-states.html',
  styleUrl: './member-states.scss',
})
export class MemberStates {
  readonly exersiceService = inject(ExersiceService);
  readonly memberService = inject(MemberService);

  readonly members = this.memberService.members;
  readonly progresses = this.exersiceService.todaysExerciseProgresses;
  readonly progressEditEnabled = this.exersiceService.progressEditEnabled;

  readonly exercises = this.exersiceService.exercises;

  constructor() {
    effect(() => {
      if (!this.exersiceService.loadedProgresses()) return;
      if (
        this.members().length > 0 &&
        this.exercises().length > 0 &&
        this.progresses().length === 0
      ) {
        this.exersiceService.initExerciseProgresses(this.members().map(({ id }) => id));
      }
    });
  }
  formatlabel = (value: number) => value.toString();

  getMemberStates(memberId: string): ExerciseProgress[] {
    return this.progresses()
      .filter((s) => s.memberId === memberId)
      .sort((a, b) => a.exerciseId.localeCompare(b.exerciseId));
  }
  getExercise(exerciseId: string): Exercise | undefined {
    return this.exercises().find((e) => e.id === exerciseId);
  }
  getMember(memberId: string): Member | undefined {
    return this.members().find((m) => m.id === memberId);
  }

  onProgressChanged(exerciseId: string, memberId: string, progress: number): void {
    this.exersiceService.setExerciseProgress(exerciseId, memberId, progress);
  }

  getExerciseProgressPercantage(exerciseId: string, memberId: string): number {
    const progress = this.progresses().find(
      (s) => s.exerciseId === exerciseId && s.memberId === memberId
    );
    const exercise = this.getExercise(exerciseId);
    if (!progress || !exercise) return 0;

    return Math.round((progress.progress / exercise.target) * 100);
  }

  /**
   * Calculate overall daily progress for a member
   * @param memberId
   * @returns {number} percentage of overall daily progress
   */
  getDailyProgress(memberId: string): number {
    const memberStates = this.getMemberStates(memberId);
    if (memberStates.length === 0) return 0;

    const totalPercentage = memberStates.reduce((acc, state) => {
      const exercise = this.getExercise(state.exerciseId);
      if (!exercise) return acc;
      return acc + (state.progress / exercise.target) * 100;
    }, 0);

    return Math.round(totalPercentage / memberStates.length);
  }

  getSliderColorClass(memberId: string): string {
    const progress = this.getDailyProgress(memberId);
    if (progress < 33) return 'daily-progress__begin';
    if (progress < 67) return 'daily-progress__intermediate';
    if (progress < 99) return 'daily-progress__advanced';
    return 'daily-progress__completed';
  }
}
