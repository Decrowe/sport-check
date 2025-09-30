import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MemberService } from '@domains/members/services';
import { ConfirmClickDirective } from '@shared';
import { LoginService } from '@shared/authentication';
import { Member } from '../../models';

@Component({
  selector: 'app-manage-members',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatExpansionModule,
    ConfirmClickDirective,
  ],
  templateUrl: './manage-members.html',
  styleUrl: './manage-members.scss',
})
export class ManageMembers {
  private memberService = inject(MemberService);
  private loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);

  readonly memberFormPanel = viewChild.required(MatExpansionPanel);
  readonly selectedMemberId = signal<string | undefined>(undefined);
  readonly editing = this.selectedMemberId;

  readonly currentMember = this.loginService.member;
  readonly members = this.memberService.members;

  readonly memberGroup = this.formBuilder.nonNullable.group({
    username: this.formBuilder.nonNullable.control<string>('', [Validators.required]),
    displayName: this.formBuilder.nonNullable.control<string>('', [Validators.required]),
  });

  constructor() {
    this.memberService.loadMembers();
  }

  onMemberSelected(member: Member) {
    this.memberGroup.patchValue(member);
    this.selectedMemberId.set(member.username);
    this.memberFormPanel().open();
  }

  onDeleteMember(username: string) {
    this.memberService.removeMember(username);
  }

  onDeleteSelfConfirmed(username: string) {
    if (this.currentMember()?.username !== username) return;
    this.memberService.removeMember(username);
    this.loginService.logout();
  }

  onSubmit() {
    if (this.memberGroup.invalid) return;

    const member = this.memberGroup.getRawValue();

    this.memberService.editMember(member);
    this.selectedMemberId.set(undefined);
    this.memberGroup.reset();
  }
}
