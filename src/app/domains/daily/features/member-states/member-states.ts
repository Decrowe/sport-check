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
}
