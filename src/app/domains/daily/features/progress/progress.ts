import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { isMemberOfGroup } from '@domains/daily/models';
import { GroupService, ProgressService } from '@domains/daily/services';
import { ExerciseAPIService } from '@domains/exercises/API';
import { LoginService } from '@shared/authentication';
import { Toolbar } from '../../shared';
import { DailyProgressChartComponent } from './daily-progress-chart/daily-progress-chart.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
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
    GroupProgressPanelComponent,
    DailyProgressChartComponent,
    GroupProgressChartComponent,
    ExerciseListComponent,
    Toolbar,
  ],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {
  readonly loginService = inject(LoginService);
  readonly progressService = inject(ProgressService);
  readonly groupService = inject(GroupService);
  readonly exerciseAPI = inject(ExerciseAPIService);

  readonly member = this.loginService.member;
  readonly groups = this.groupService.groups;
  readonly groupsJoined = computed(() => {
    const member = this.member();
    if (!member) return [];
    return this.groups().filter((group) => isMemberOfGroup(member.username, group));
  });
  readonly exercises = this.exerciseAPI.exercises;
  readonly editProgressEnabled = this.progressService.progressEditEnabled;
  readonly todaysProgress = this.progressService.todaysProgress;
  readonly selectedGroupId = signal<string | undefined>(undefined);
  readonly selectedGroup = computed(() =>
    this.groups().find((group) => group.id === this.selectedGroupId())
  );

  readonly progressMap = computed(() => {
    const map: Record<string, number> = {};
    this.todaysProgress().forEach((p) => (map[p.exerciseId] = p.amount));
    return map;
  });

  constructor() {
    this.groupService.loadGroups();
    this.exerciseAPI.loadExercises();
    const member = this.loginService.member();
    if (member) {
      this.progressService.loadProgress(member.username);
    }
  }

  onGroupDetail(groupId: string | undefined) {
    if (!groupId) return;
    const group = this.groups().find((group) => group.id === groupId);
    if (!group) return;
    this.selectedGroupId.set(groupId);
    this.progressService.setGroup(group);
  }

  onClearGroup() {
    this.selectedGroupId.set(undefined);
  }

  onExerciseChange(event: { id: string; value: number }) {
    const member = this.loginService.member();
    if (!member) return;

    this.progressService.setExerciseProgress(member.username, event.id, event.value);
  }
}
