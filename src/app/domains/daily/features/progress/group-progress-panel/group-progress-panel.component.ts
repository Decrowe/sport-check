import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Group } from '@domains/daily/models';
import { ProgressService } from '@domains/daily/services';

@Component({
  selector: 'app-group-progress-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './group-progress-panel.component.html',
  styleUrls: ['./group-progress-panel.component.scss'],
})
export class GroupProgressPanelComponent {
  private progressService = inject(ProgressService);
  @Input() group: Group | undefined;
  @Input() memberId: string | undefined;
  @Output() detail = new EventEmitter<Group | undefined>();

  private progressMap = computed(() => {
    const map = new Map<string, number>();
    this.progressService.todaysProgress().forEach(({ id, progress }) => map.set(id, progress));
    return map;
  });

  percent = computed(() => {
    const g = this.group;
    if (!g) return 0;
    const totalGoal = g.exercises.reduce((sum, e) => sum + (e.goal || 0), 0);
    if (!totalGoal) return 0;
    const achieved = g.exercises.reduce((sum, e) => sum + (this.progressMap().get(e.id) || 0), 0);
    return (achieved / totalGoal) * 100;
  });
}
