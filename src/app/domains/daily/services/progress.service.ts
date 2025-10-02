import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { deepClone, LoginService } from '@shared';
import { MemberExerciseProgressDataService } from '../infrastructure/member-exercise-progress.data.service';
import { Group } from '../models/group';
import { MemberExerciseProgress } from '../models/member-exercise-progress';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private dataService = inject(MemberExerciseProgressDataService);
  private loginService = inject(LoginService);

  private _memmber = this.loginService.member;

  private _group = signal<Group | undefined>(undefined);
  readonly group = computed(() => deepClone(this._group()));

  private _date = signal(new Date());
  readonly date = computed(() => {
    return deepClone(this._date());
  });
  private dateKey = computed(
    () => this._date().toISOString().substring(0, 10) // yyyy-mm-dd
  );

  readonly progressEditEnabled = computed(
    () => this._date().toDateString() === new Date().toDateString()
  );

  private _todaysProgress = signal<{ exerciseId: string; amount: number }[]>([]);
  readonly todaysProgress = computed(() => deepClone(this._todaysProgress()));

  private _groupMembersProgress = signal<Map<string, { exerciseId: string; amount: number }[]>>(
    new Map()
  );
  readonly groupMembersProgress = computed(() => {
    const cloned = new Map<string, { exerciseId: string; amount: number }[]>();
    this._groupMembersProgress().forEach((v, k) => {
      cloned.set(
        k,
        v.map((e) => ({ ...e }))
      );
    });
    return cloned;
  });

  constructor() {
    effect(() => {
      const dateKey = this.dateKey();
      const memberId = this._memmber()?.username;

      if (!memberId) return;
      this.loadProgress(memberId, dateKey);
    });
    effect(() => {
      const dateKey = this.dateKey();
      const group = this._group();

      if (!group) return;
      this.loadGroupMembersProgress(group, dateKey);
    });
  }

  setDate(date: Date) {
    this._date.set(date);
  }
  setGroup(group: Group | undefined) {
    this._group.set(group);
  }

  loadProgress(memberId: string, date?: string) {
    this.dataService
      .getMemberProgress(memberId, date ?? this.dateKey())
      .then((progress) => {
        if (!progress) {
          this._todaysProgress.set([]);
          return;
        }
        this._todaysProgress.set(
          progress.exercises.map((exercise) => ({
            exerciseId: exercise.id,
            amount: exercise.amount,
          }))
        );
      })
      .catch(() => this._todaysProgress.set([]));
  }
  loadGroupMembersProgress(group: Group, date?: string) {
    Promise.all(
      group.members.map((memberId) =>
        this.dataService.getMemberProgress(memberId, date ?? this.dateKey())
      )
    ).then((results) => {
      const map = new Map<string, { exerciseId: string; amount: number }[]>();
      results.forEach((progress, idx) => {
        const memberId = group.members[idx];
        map.set(
          memberId,
          progress
            ? progress.exercises.map(({ id, amount }) => ({
                exerciseId: id,
                amount,
              }))
            : []
        );
      });

      this._groupMembersProgress.set(map);
    });
  }

  setExerciseProgress(memberId: string, exerciseId: string, amount: number) {
    if (amount < 0) amount = 0;
    const updated = [...this._todaysProgress()];
    const idx = updated.findIndex((e) => e.exerciseId === exerciseId);
    if (idx >= 0) updated[idx] = { exerciseId, amount };
    else updated.push({ exerciseId, amount });
    this._todaysProgress.set(updated);
    // persist
    const record: MemberExerciseProgress = {
      memberId,
      date: this.dateKey(),
      exercises: updated.map((e) => ({ id: e.exerciseId, amount: e.amount })),
    };
    this.dataService.setMemberProgress(record).then((updated) => {
      if (updated) {
        this._todaysProgress.set(
          updated.exercises.map((exercise) => ({
            exerciseId: exercise.id,
            amount: exercise.amount,
          }))
        );
        // Update groupMembersProgress map for current user if group is set
        const group = this._group();
        if (group && group.members.includes(memberId)) {
          const map = new Map(this._groupMembersProgress());
          map.set(
            memberId,
            updated.exercises.map((exercise) => ({
              exerciseId: exercise.id,
              amount: exercise.amount,
            }))
          );
          this._groupMembersProgress.set(map);
        }
      }
    });
  }
}
