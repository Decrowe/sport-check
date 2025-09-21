import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { Exercise, ExerciseState, Member } from '@domains/daily/enteties';
import { ExersiceService, MemberService } from '@domains/daily/services';

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
  ],
  templateUrl: './member-states.html',
  styleUrl: './member-states.scss',
})
export class MemberStates {
  readonly exersiceService = inject(ExersiceService);
  readonly memberService = inject(MemberService);

  readonly members = this.memberService.members;
  readonly states = this.exersiceService.todaysExerciseStates;
  readonly exercises = this.exersiceService.exercises;

  formatlabel = (value: number) => value.toString();

  getMemberStates(memberId: number): ExerciseState[] {
    return this.states().filter((s) => s.memberId === memberId);
  }
  getExercise(exerciseId: number): Exercise | undefined {
    return this.exercises().find((e) => e.id === exerciseId);
  }
  getMember(memberId: number): Member | undefined {
    return this.members().find((m) => m.id === memberId);
  }

  onProgressChanged(exerciseId: number, memberId: number, progress: number): void {
    this.exersiceService.setStateProgress(exerciseId, memberId, progress);
  }

  getExerciseProgressPercantage(exerciseId: number, memberId: number): number {
    const state = this.states().find((s) => s.exerciseId === exerciseId && s.memberId === memberId);
    const exercise = this.getExercise(exerciseId);
    if (!state || !exercise) return 0;

    return Math.round((state.progress / exercise.target) * 100);
  }

  /**
   * Calculate overall daily progress for a member
   * @param memberId
   * @returns {number} percentage of overall daily progress
   */

  getDailyProgress(memberId: number): number {
    const memberStates = this.getMemberStates(memberId);
    if (memberStates.length === 0) return 0;

    const totalPercentage = memberStates.reduce((acc, state) => {
      const exercise = this.getExercise(state.exerciseId);
      if (!exercise) return acc;
      return acc + (state.progress / exercise.target) * 100;
    }, 0);

    return Math.round(totalPercentage / memberStates.length);
  }

  getSliderColorClass(memberId: number): string {
    const progress = this.getDailyProgress(memberId);
    if (progress < 33) return 'daily-progress__begin';
    if (progress < 67) return 'daily-progress__intermediate';
    if (progress < 99) return 'daily-progress__advanced';
    return 'daily-progress__completed';
  }
}
