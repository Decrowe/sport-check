import { Component, computed, inject, input } from '@angular/core';
import { MemberService } from '@domains/members/services';

@Component({
  selector: 'app-member-chip',
  imports: [],
  templateUrl: './member-chip.html',
  styleUrl: './member-chip.scss',
})
export class MemberChip {
  private memberService = inject(MemberService);

  memberId = input<string | undefined>(undefined);
  progress = input<number>(0);
  circleColor = input<string>('gold');

  member = computed(() => {
    return this.memberService.members().find((m) => m.username === this.memberId());
  });
}
