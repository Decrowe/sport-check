import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { AddGroup, Group } from '@domains/daily/models';
import { GroupService } from '@domains/daily/services';
import { ExerciseAPIService } from '@domains/exercises/API';
import { MemberAPIService } from '@domains/members/API';
import { LoginService } from '@shared/authentication';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';

@Component({
  selector: 'app-manage-groups',
  imports: [
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './manage-groups.html',
  styleUrl: './manage-groups.scss',
})
export class ManageGroups {
  private groupService = inject(GroupService);
  private exerciseAPIService = inject(ExerciseAPIService);
  private memberAPIService = inject(MemberAPIService);
  private dialog = inject(MatDialog);
  private loginService = inject(LoginService);

  readonly groups = this.groupService.groups;
  readonly exercises = this.exerciseAPIService.exercises;
  readonly members = this.memberAPIService.members;
  readonly member = this.loginService.member;
  readonly exerciseMap = computed(() => {
    const map = new Map<string, { id: string; name: string; unit: string }>();
    this.exercises().forEach((e) => map.set(e.id, e));
    return map;
  });
  readonly memberMap = computed(() => {
    const map = new Map<string, { username: string; displayName: string }>();
    this.members().forEach((m) => map.set(m.username, m));
    return map;
  });

  expandedGroupId = signal<string | null>(null);

  constructor() {
    this.groupService.loadGroups();
    this.exerciseAPIService.loadExercises();
    this.memberAPIService.loadMembers();
  }

  isDetailRow = (_: number, row: Group) => this.expandedGroupId() === row.id;

  toggleExpand(group: Group, event?: Event) {
    event?.stopPropagation();
    this.expandedGroupId.update((curr) => (curr === group.id ? null : group.id));
  }

  onOpened(id: string) {
    this.expandedGroupId.set(id);
  }

  onClosed(id: string) {
    if (this.expandedGroupId() === id) {
      this.expandedGroupId.set(null);
    }
  }

  memberInGroup(group: Group): boolean {
    const member = this.member();
    if (!member) return false;
    return (
      group.members.includes(member.username || '__nope__') ||
      group.members.includes(member.displayName)
    );
  }

  joinGroup(group: Group, event?: Event) {
    event?.stopPropagation();
    const member = this.member();
    if (!member || this.memberInGroup(group)) return;
    const updated: Group = { ...group, members: [...group.members, member.username] };
    this.groupService.editGroup(updated);
  }

  leaveGroup(group: Group, event?: Event) {
    event?.stopPropagation();
    const member = this.member();
    if (!member || !this.memberInGroup(group)) return;
    const updated: Group = {
      ...group,
      members: group.members.filter((m) => m !== member.username && m !== member.displayName),
    };
    this.groupService.editGroup(updated);
  }

  openDialog(group?: Group) {
    const ref = this.dialog.open(GroupDialogComponent, {
      data: { group },
      panelClass: 'full-screen-dialog',
    });
    ref.afterClosed().subscribe((result: (AddGroup | Group) | undefined) => {
      if (!result) return; // dialog cancelled
      if ('id' in result) {
        this.groupService.editGroup(result as Group);
      } else {
        // ensure ownerId is set for new groups
        const ownerId = this.member()?.username;
        const ownerName = this.member()?.displayName;
        if (!ownerId || !ownerName) return;

        const config: AddGroup = { ...result, ownerId, ownerName };
        this.groupService.addGroup(config);
      }
    });
  }

  onGroupSelected(group: Group) {
    this.openDialog(group);
  }
  onAddGroup() {
    this.openDialog();
  }
  onDeleteGroup(id: string) {
    this.groupService.removeGroup(id);
  }
}
