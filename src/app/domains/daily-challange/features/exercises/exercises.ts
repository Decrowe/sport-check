import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddExercise, Exercise } from '@domains/daily-challange/enteties';
import { ExersiceService } from '@domains/daily-challange/services';

@Component({
  selector: 'app-exercises',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './exercises.html',
  styleUrl: './exercises.scss',
})
export class Exercises {
  private service = inject(ExersiceService);
  private formBuilder = inject(FormBuilder);

  readonly selectedExerciseId = signal<number | undefined>(undefined);
  readonly editing = this.selectedExerciseId;

  readonly exercises = this.service.exercises;

  readonly exerciseGroup = this.formBuilder.nonNullable.group<AddExercise>({
    name: '',
    target: 0,
    unit: 'repeatitions',
  });

  get nameControl() {
    return this.exerciseGroup.controls.name;
  }
  get targetControl() {
    return this.exerciseGroup.controls.target;
  }
  get unitControl() {
    return this.exerciseGroup.controls.unit;
  }

  private saveEdits() {
    if (this.exerciseGroup.valid) {
      const id = this.selectedExerciseId();
      const { name, target, unit } = this.exerciseGroup.value;
      if (id === undefined || name === undefined || target === undefined || unit === undefined)
        return;

      this.service.editExercise({ id, name, target, unit });

      this.selectedExerciseId.set(undefined);
      this.exerciseGroup.reset();
    }
  }
  private addExercise() {
    if (this.exerciseGroup.valid) {
      const { name, target, unit } = this.exerciseGroup.value;
      if (name === undefined || target === undefined || unit === undefined) return;
      this.service.addExercise({ name, target, unit });
      this.exerciseGroup.reset({ name: '', target: 0, unit: 'repeatitions' });
    }
  }

  onAddExercise() {
    this.selectedExerciseId.set(undefined);
    this.exerciseGroup.reset({ name: '', target: 0, unit: 'repeatitions' });
  }

  onExerciseSelected(exercise: Exercise) {
    const { id, name, target, unit } = exercise;
    this.exerciseGroup.patchValue({ name, target, unit });
    this.selectedExerciseId.set(id);
  }

  onSubmit() {
    if (this.selectedExerciseId() !== undefined) {
      this.saveEdits();
    } else {
      this.addExercise();
    }
  }
}
