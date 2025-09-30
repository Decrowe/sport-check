import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { deepClone } from '@shared';

export interface EditExerciseProgressDialogData {
  id: string;
  name: string;
  unit: string;
  value: number;
}
@Component({
  selector: 'app-edit-exercise-progress-dialog',
  standalone: true,
  templateUrl: './exercise-progress-dialog.component.html',
  styleUrls: ['./exercise-progress-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class EditExerciseProgressDialogComponent {
  value: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditExerciseProgressDialogData,
    private dialogRef: MatDialogRef<EditExerciseProgressDialogComponent>
  ) {
    this.value = deepClone(data.value);
  }

  save() {
    this.dialogRef.close(this.value);
  }

  close() {
    this.dialogRef.close();
  }
}
