import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { GroupService, ProgressService } from '@domains/daily/services';
import { ExerciseAPIService } from '@domains/exercises/API';
import { LoginService } from '@shared/authentication';
import { Toolbar } from '../../shared';
import { DailyProgressChartComponent } from './daily-progress-chart/daily-progress-chart.component';
import { ExerciseListComponent } from './exercise-bottom-sheet/exercise-bottom-sheet.component';
import { GroupProgressChartComponent } from './group-progress-chart/group-progress-chart.component';
import { GroupProgressPanelComponent } from './group-progress-panel/group-progress-panel.component';

@Component({
  selector: 'app-progress',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSliderModule,
    MatCheckboxModule,
    MatDividerModule,
    MatBottomSheetModule,
    GroupProgressPanelComponent,
    DailyProgressChartComponent,
    GroupProgressChartComponent,
    Toolbar,
  ],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {
  private loginService = inject(LoginService);
  private progressService = inject(ProgressService);
  private groupService = inject(GroupService);
  private exerciseAPI = inject(ExerciseAPIService);
  private bottomSheet = inject(MatBottomSheet);

  readonly currentMember = this.loginService.member;
  readonly groups = this.groupService.groups;

  readonly groupsJoined = this.groupService.joinedGroups;

  readonly exercises = this.exerciseAPI.exercises;
  readonly editProgressEnabled = this.progressService.progressEditEnabled;
  readonly todaysProgress = this.progressService.todaysProgress;
  readonly group = this.progressService.selectedGroup;

  readonly progressMap = computed(() => {
    const map: Record<string, number> = {};
    this.todaysProgress().forEach(({ id, progress }) => (map[id] = progress));
    return map;
  });

  constructor() {
    this.groupService.loadGroups();
    this.exerciseAPI.loadExercises();

    const member = this.loginService.member();
    if (member) this.progressService.loadProgress(member.username);
  }

  onGroupDetail(groupId: string | undefined) {
    const group = this.groups().find((group) => group.id === groupId);
    if (!group) return;

    this.progressService.setGroup(group);
  }

  onClearGroup() {
    this.progressService.setGroup(undefined);
  }

  onExerciseChange(event: { id: string; value: number }) {
    const member = this.loginService.member();
    if (!member) return;

    this.progressService.setExerciseProgress(member.username, event.id, event.value);
  }

  onOpenExerciseSheet() {
    if (!this.editProgressEnabled()) return;
    this.bottomSheet.open(ExerciseListComponent, {});
  }
}
