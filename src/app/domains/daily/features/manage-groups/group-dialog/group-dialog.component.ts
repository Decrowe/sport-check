import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddGroup, Group, GroupInfo } from '@domains/daily/models';
import { ExerciseAPIService } from '@domains/exercises/API';
import { MemberAPIService } from '@domains/members/API';
import { deepClone } from '@shared';

export type GroupDialogData = { group?: Group };

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class GroupDialogComponent {
  private fb = inject(FormBuilder);
  private exerciseApi = inject(ExerciseAPIService);
  private memberApi = inject(MemberAPIService);
  private ref = inject(MatDialogRef<GroupDialogComponent>);

  exercises = this.exerciseApi.exercises;
  members = this.memberApi.members;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    exercises: [[] as { id: string; goal: number }[]],
    members: [[] as string[]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: GroupDialogData) {
    if (data.group) {
      const group: GroupInfo = deepClone(data.group);
      this.form.patchValue(group);
    }
  }

  exerciseName(id: string): string {
    return this.exercises().find((e) => e.id === id)?.name || id;
  }
  exerciseUnit(id: string): string {
    return this.exercises().find((e) => e.id === id)?.unit || '';
  }
  goalFor(id: string): number {
    return this.form.value.exercises?.find((e) => e.id === id)?.goal ?? 0;
  }
  exerciseCompare = (a: { id: string } | null, b: { id: string } | null) =>
    a && b ? a.id === b.id : a === b;

  onGoalChange(id: string, goal: number) {
    if (Number.isNaN(goal)) return;
    if (goal < 0) goal = 0;
    const control = this.form.get('exercises');
    if (!control) return;
    const arr = control.value as { id: string; goal: number }[];
    const target = arr?.find((e) => e.id === id);
    if (target) {
      target.goal = goal;
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  onExercisesChanged() {
    const current = this.form.value.exercises || [];
    const unique = current.reduce((acc: { id: string; goal: number }[], cur) => {
      if (!acc.find((a) => a.id === cur.id)) acc.push(cur);
      return acc;
    }, []);
    this.form.get('exercises')!.setValue(unique as any);
  }

  removeExercise(id: string) {
    const control = this.form.get('exercises');
    if (!control) return;
    const arr = (control.value as { id: string; goal: number }[]) || [];
    const filtered = arr.filter((e) => e.id !== id);
    control.setValue(filtered as any);
  }

  /**
   * Close dialog returning either an AddGroup (no id) for creation
   * or a full Group (with id) for edits. No side‑effects here; caller decides.
   */
  onSave() {
    if (this.form.invalid) return;
    const value = this.form.value as AddGroup; // shape without id
    const id = this.data.group?.id;
    const result: AddGroup | Group = id ? ({ id, ...value } as Group) : value;
    this.ref.close(result);
  }
}
