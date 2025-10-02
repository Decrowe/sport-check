import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ExerciseService } from '@domains/exercises/services';
import { ExerciseUnit, ExerciseUnits } from '@shared';
import { AddExercise, Exercise } from '../../models';

@Component({
  selector: 'app-manage-exercises',
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
  templateUrl: './manage-exercises.html',
  styleUrl: './manage-exercises.scss',
})
export class ManageExercises {
  private exerciseService = inject(ExerciseService);
  private formBuilder = inject(FormBuilder);

  readonly expensionPanel = viewChild.required(MatExpansionPanel);
  readonly selectedExerciseId = signal<string | undefined>(undefined);
  readonly editing = this.selectedExerciseId;
  readonly units = Object.entries(ExerciseUnits).filter(([key]) => key !== 'Unknown');

  readonly exercises = this.exerciseService.exercises;

  readonly exerciseGroup = this.formBuilder.nonNullable.group({
    name: this.formBuilder.nonNullable.control<string>('', [Validators.required]),
    unit: this.formBuilder.nonNullable.control<ExerciseUnit>(
      {
        value: ExerciseUnits.Repetitions,
        disabled: false,
      },
      [Validators.required]
    ),
  });

  get nameControl() {
    return this.exerciseGroup.controls.name;
  }

  get unitControl() {
    return this.exerciseGroup.controls.unit;
  }

  constructor() {
    this.exerciseService.loadExercises();
  }

  onAddExercise() {
    this.selectedExerciseId.set(undefined);
    this.exerciseGroup.reset({ name: '', unit: 'repetitions' });
  }

  onExerciseSelected(exercise: Exercise) {
    const { id, name, unit } = exercise;
    this.exerciseGroup.patchValue({ name, unit });
    this.selectedExerciseId.set(id);
    this.expensionPanel().open();
  }

  onDeleteExercise(id: string) {
    this.exerciseService.removeExercise(id);
  }

  onSubmit() {
    if (this.exerciseGroup.invalid) return;

    const id = this.selectedExerciseId();
    const config = this.exerciseGroup.getRawValue() as AddExercise;

    if (id !== undefined) {
      this.exerciseService.editExercise({ id, ...config });
    } else {
      this.exerciseService.addExercise(config);
    }

    this.selectedExerciseId.set(undefined);
    this.exerciseGroup.reset();
  }
}
