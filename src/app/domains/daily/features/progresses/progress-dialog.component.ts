import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Exercise, Progress } from '@domains/daily/enteties';

export interface ProgressDialogData {
  memberId: string;
  exercises: Exercise[];
  progresses: Progress[];
}

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrl: './progress-dialog.component.scss',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class ProgressDialogComponent {
  readonly data: ProgressDialogData = inject(MAT_DIALOG_DATA);
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<ProgressDialogComponent>, private fb: FormBuilder) {
    this.form = this.fb.group({});
    this.data.exercises.forEach((exercise) => {
      const progress = this.data.progresses.find((p) => p.exerciseId === exercise.id);
      this.form.addControl(exercise.id, new FormControl(progress ? progress.progress : 0));
    });
  }

  setComplete(exerciseId: string, checked: boolean) {
    this.form.get(exerciseId)?.setValue(checked ? 100 : 0);
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
}
