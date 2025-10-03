import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { ExerciseKernal } from '@shared';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { ExerciseProgress } from '../../../models/exercise-progress';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-daily-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-progress-chart.component.html',
  styleUrls: ['./daily-progress-chart.component.scss'],
})
export class DailyProgressChartComponent {
  exercises = input<ExerciseKernal[]>([]);
  progress = input<ExerciseProgress[]>([]);
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private chart = signal<Chart | undefined>(undefined);

  data = computed(() => {
    const map = new Map<string, number>();
    this.progress().forEach(({ id, progress }) => map.set(id, progress));
    const labels = this.exercises().map((exercise) => exercise.name);
    const values = this.exercises().map((exercise) => map.get(exercise.id) || 0);
    return { labels, values };
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
        chart.data.datasets[0].data = data.values;
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
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Progress',
            data: data.values,
            backgroundColor: '#1976d2',
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    this.chart.set(newChart);
  }
}
