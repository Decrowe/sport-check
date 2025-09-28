import { computed, inject, Injectable, signal } from '@angular/core';
import { GroupDataService } from '@domains/daily/infrastructure';
import { AddGroup, Group } from '@domains/daily/models';
import { deepClone } from '@shared';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private _groups = signal<Group[]>([]);
  readonly groups = computed(() => deepClone(this._groups()));

  private dataService = inject(GroupDataService);

  constructor() {
    this.loadGroups();
  }

  loadGroups() {
    this.dataService.getGroups().then((groups) => {
      this._groups.set(groups);
    });
  }

  private setGroup(group: Group): Promise<Group> {
    return this.dataService.setGroup(group);
  }

  private deleteGroup(groupId: string): Promise<void> {
    return this.dataService.deleteGroup(groupId);
  }

  addGroup(config: AddGroup) {
    const id = uuidv4();
    const group: Group = {
      id,
      name: config.name,
      exercises: config.exercises,
      members: config.members,
      description: config.description,
      ownerId: config.ownerId,
      ownerName: config.ownerName,
    };
    this.setGroup(group).then((group) => {
      this._groups.update((groups) => [...groups, group]);
    });
  }

  editGroup(group: Group) {
    this.setGroup(group).then((updated) => {
      this._groups.update((groups) =>
        groups.map((g) => (g.id === updated.id ? { ...g, ...updated } : g))
      );
    });
  }

  removeGroup(id: string) {
    this.deleteGroup(id).then(() => {
      this._groups.update((groups) => groups.filter((g) => g.id !== id));
    });
  }
}
