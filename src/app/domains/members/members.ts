import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Member } from '@domains/members/enteties';
import { MemberService } from '@domains/members/services';

@Component({
  selector: 'app-members',
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
  ],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  private memberService = inject(MemberService);
  private formBuilder = inject(FormBuilder);

  readonly memberFormPanel = viewChild.required(MatExpansionPanel);
  readonly selectedMemberId = signal<string | undefined>(undefined);
  readonly editing = this.selectedMemberId;

  readonly members = this.memberService.members;

  readonly memberGroup = this.formBuilder.nonNullable.group({
    name: '',
  });

  onMemberSelected(member: Member) {
    this.memberGroup.patchValue({ name: member.name });
    this.selectedMemberId.set(member.id);
    this.memberFormPanel().open();
  }

  onAddMember() {
    this.selectedMemberId.set(undefined);
    this.memberGroup.reset({ name: '' });
  }

  onDeleteMember(id: string) {
    this.memberService.removeMember(id);
  }

  onSubmit() {
    const name = this.memberGroup.value.name;
    if (!name) return;
    const id = this.selectedMemberId();
    if (id) {
      this.memberService.editMember({ id, name });
    } else {
      this.memberService.addMember({ name });
    }
    this.selectedMemberId.set(undefined);
    this.memberGroup.reset({ name: '' });
  }
}
