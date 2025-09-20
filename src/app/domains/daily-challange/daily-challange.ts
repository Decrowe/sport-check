import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DailyChallengeService } from './daily-challange.service';

@Component({
  selector: 'app-daily-challange',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTableModule, UpperCasePipe],
  templateUrl: './daily-challange.html',
  styleUrl: './daily-challange.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyChallange {
  private service = inject(DailyChallengeService);

  readonly exercises = this.service.exercises;
  readonly members = this.service.members;
  readonly exerciseStates = this.service.exerciseStates;

  exerciseCompleted(exerciseId: number, memberId: number): boolean {
    const state = this.exerciseStates().find(
      (s) => s.exerciseId === exerciseId && s.memberId === memberId
    );
    return state?.completed ?? false;
  }

  completeExercise(exerciseId: number, memberId: number): void {
    this.service.exerciseDone(exerciseId, memberId);
  }
}
