import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { deepClone, LoginService } from '@shared';
import { MemberExerciseProgressDataService } from '../infrastructure/member-exercise-progress.data.service';
import { ExerciseProgress } from '../models/exercise-progress';
import { Group } from '../models/group';
import { MemberExerciseProgress } from '../models/member-exercise-progress';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private dataService = inject(MemberExerciseProgressDataService);
  private loginService = inject(LoginService);

  private _memmber = this.loginService.member;

  private _selectedGroup = signal<Group | undefined>(undefined);
  readonly selectedGroup = computed(() => {
    const group = this._selectedGroup();
    return group ? deepClone(group) : undefined;
  });

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

  private _todaysProgress = signal<ExerciseProgress[]>([]);
  readonly todaysProgress = computed(() => deepClone(this._todaysProgress()));

  private _groupMembersProgress = signal<Map<string, ExerciseProgress[]>>(new Map());
  readonly groupMembersProgress = computed(() => {
    const cloned = new Map<string, ExerciseProgress[]>();
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
      const group = this._selectedGroup();

      if (!group) return;
      this.loadGroupMembersProgress(group, dateKey);
    });
  }

  setDate(date: Date) {
    this._date.set(date);
  }
  setGroup(group: Group | undefined) {
    this._selectedGroup.set(group);
  }

  loadProgress(memberId: string, date?: string) {
    this.dataService
      .getMemberProgress(memberId, date ?? this.dateKey())
      .then((progress) => {
        if (!progress) {
          this._todaysProgress.set([]);
          return;
        }
        this._todaysProgress.set(progress.progresses);
      })
      .catch(() => this._todaysProgress.set([]));
  }
  loadGroupMembersProgress(group: Group, date?: string) {
    Promise.all(
      group.members.map((memberId) =>
        this.dataService.getMemberProgress(memberId, date ?? this.dateKey())
      )
    ).then((results) => {
      const map = new Map<string, ExerciseProgress[]>();
      results.forEach((progress, idx) => {
        const memberId = group.members[idx];
        map.set(memberId, progress ? progress.progresses : []);
      });

      this._groupMembersProgress.set(map);
    });
  }

  setExerciseProgress(memberId: string, exerciseId: string, progress: number) {
    if (progress < 0) progress = 0;
    const updated = deepClone(this._todaysProgress());

    const index = updated.findIndex((e) => e.id === exerciseId);
    if (index >= 0) updated[index] = { id: exerciseId, progress };
    else updated.push({ id: exerciseId, progress });
    // this._todaysProgress.set(updated);
    // persist
    const record: MemberExerciseProgress = {
      memberId,
      date: this.dateKey(),
      progresses: updated.map((e) => ({ id: e.id, progress: e.progress })),
    };
    this.dataService.setMemberProgress(record).then((updated) => {
      if (updated) {
        this._todaysProgress.set(
          updated.progresses.map(({ id, progress }) => ({
            id,
            progress,
          }))
        );
        // Update groupMembersProgress map for current user if group is set
        const group = this._selectedGroup();
        if (group && group.members.includes(memberId)) {
          const map = new Map(this._groupMembersProgress());
          map.set(
            memberId,
            updated.progresses.map(({ id, progress }) => ({
              id,
              progress,
            }))
          );
          this._groupMembersProgress.set(map);
        }
      }
    });
  }
}
