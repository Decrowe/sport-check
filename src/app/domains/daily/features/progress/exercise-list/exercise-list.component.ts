import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProgressService } from '@domains/daily/services';
import { EditExerciseProgressDialogComponent } from '../exercise-progress-dialog/exercise-progress-dialog.component';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss'],
})
export class ExerciseListComponent {
  private progressService = inject(ProgressService);
  private dialog = inject(MatDialog);

  readonly editProgressEnabled = this.progressService.progressEditEnabled;

  exercises = input<{ id: string; name: string; unit: string }[]>([]);
  progressMap = input<Record<string, number>>({});
  progressMapChange = output<Record<string, number>>();
  progressChange = output<{ id: string; value: number }>();

  openDialog(exercise: { id: string; name: string; unit: string }) {
    this.dialog
      .open(EditExerciseProgressDialogComponent, {
        width: '400px',
        data: {
          id: exercise.id,
          name: exercise.name,
          unit: exercise.unit,
          value: this.progressMap()[exercise.id] ?? 0,
        },
        panelClass: 'exercise-progress-dialog',
      })
      .afterClosed()
      .subscribe((result: number | undefined) => {
        if (typeof result === 'number') {
          this.progressMapChange.emit({ ...this.progressMap(), [exercise.id]: result });
          this.progressChange.emit({ id: exercise.id, value: result });
        }
      });
  }
}
