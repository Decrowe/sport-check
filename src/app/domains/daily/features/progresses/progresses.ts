import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { Exercise, Progress } from '@domains/daily/enteties';
import { ExersiceService } from '@domains/daily/services';
import { MemberService } from '@domains/members';
import { Member } from '@domains/members/enteties';
import { LoginService } from '@shared/authentication';
import { Toolbar } from '../toolbar/toolbar';
import { ProgressDialogComponent } from './progress-dialog.component';

@Component({
  selector: 'app-progresses',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSliderModule,
    MatCheckboxModule,
    Toolbar,
  ],
  templateUrl: './progresses.html',
  styleUrl: './progresses.scss',
})
export class Progresses {
  readonly loginService = inject(LoginService);

  readonly dialog = inject(MatDialog);

  currentMember(): Member | undefined {
    const user = this.loginService.user();
    if (!user) return undefined;
    return this.members().find((m) => m.name === user.name);
  }

  readonly exersiceService = inject(ExersiceService);
  readonly memberService = inject(MemberService);

  readonly members = this.memberService.members;
  readonly sortedMembers = computed(() =>
    this.members()
      .slice()
      .sort((a, b) => this.getDailyProgress(b.id) - this.getDailyProgress(a.id))
  );
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

  getProgresses(memberId: string): Progress[] {
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
  isCurrentMember(member: Member): boolean {
    const current = this.currentMember();
    return !!current && current.id === member.id;
  }
  openProgressDialog(member: Member) {
    const exercises = this.exercises();
    const progresses = this.getProgresses(member.id);
    const dialogRef = this.dialog.open(ProgressDialogComponent, {
      data: {
        memberId: member.id,
        exercises,
        progresses,
      },
    });
    dialogRef.afterClosed().subscribe((result: Record<string, number> | undefined) => {
      if (result)
        Object.entries(result).forEach(([exerciseId, progress]) => {
          this.onProgressChanged(exerciseId, member.id, Number(progress));
        });
    });
  }

  getCircleColor(progress: number): string {
    if (progress < 33) return 'cyan';
    if (progress < 67) return 'orange';
    if (progress < 99) return 'gold';
    return 'lime';
  }
  openCurrentUserDialog() {
    const member = this.currentMember();
    if (member) {
      this.openProgressDialog(member);
    }
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
    const progresses = this.getProgresses(memberId);
    if (progresses.length === 0) return 0;

    const totalPercentage = progresses.reduce((acc, progress) => {
      const exercise = this.getExercise(progress.exerciseId);
      if (!exercise) return acc;
      return acc + (progress.progress / exercise.target) * 100;
    }, 0);

    return Math.round(totalPercentage / progresses.length);
  }

  getSliderColorClass(memberId: string): string {
    const progress = this.getDailyProgress(memberId);
    if (progress < 33) return 'daily-progress__begin';
    if (progress < 67) return 'daily-progress__intermediate';
    if (progress < 99) return 'daily-progress__advanced';
    return 'daily-progress__completed';
  }
}
