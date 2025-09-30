import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Group } from '@domains/daily/models';
import { ProgressService } from '@domains/daily/services';
import { ExerciseAPIService } from '@domains/exercises/API';
import { MemberAPIService } from '@domains/members/API';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-group-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-progress-chart.component.html',
  styleUrls: ['./group-progress-chart.component.scss'],
})
export class GroupProgressChartComponent {
  private service = inject(ProgressService);
  private exerciseService = inject(ExerciseAPIService);
  private memberService = inject(MemberAPIService);

  group = input<Group | undefined>(undefined);
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  exercises = this.exerciseService.exercises;
  members = this.memberService.members;
  private chart = signal<Chart | undefined>(undefined);

  data = computed(() => {
    const group = this.group();
    if (!group) return { labels: [], datasets: [] as any[] };
    const memberMap = this.service.groupMembersProgress();
    const exerciseIds = group.exercises.map((exercise) => exercise.id);
    const labels = exerciseIds.map(
      (id) => this.exercises().find((exercise) => exercise.id === id)?.name || id
    );
    const datasets: any[] = [];

    memberMap.forEach((progress, memberId) => {
      const map = new Map<string, number>();
      progress.forEach((p) => map.set(p.exerciseId, p.amount));
      datasets.push({
        label:
          this.members().find((member) => member.username === memberId)?.displayName || memberId,
        data: exerciseIds.map((id) => map.get(id) || 0),
        backgroundColor: this.colorFor(memberId),
      });
    });
    return { labels, datasets };
  });

  constructor() {
    // Effect 1: initialize chart when canvas is available
    effect(() => {
      const canvas = this.canvasRef()?.nativeElement;
      if (canvas && !this.chart()) {
        this.initChart(canvas);
      }
    });

    // Effect 2: update chart when data changes
    effect(() => {
      const chart = this.chart();
      if (chart) {
        const data = this.data();
        chart.data.labels = data.labels;
        chart.data.datasets = data.datasets;
        chart.update();
      }
    });
  }

  private initChart(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.data();
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: data.labels, datasets: data.datasets },
      options: { responsive: true, maintainAspectRatio: false },
    });

    this.chart.set(newChart);
  }

  private colorFor(memberId: string) {
    let hash = 0;
    for (let i = 0; i < memberId.length; i++) hash = (hash * 31 + memberId.charCodeAt(i)) >>> 0;
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    return `rgba(${r % 200}, ${g % 200}, ${b % 200}, 0.6)`;
  }
}
