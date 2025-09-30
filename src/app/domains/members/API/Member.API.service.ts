import { computed, inject, Injectable } from '@angular/core';
import { MemberKernal } from '@shared';
import { MemberService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class MemberAPIService {
  private memberService = inject(MemberService);

  members = computed(() =>
    this.memberService.members().map(({ username, displayName }) => {
      const kernal: MemberKernal = { username, displayName };
      return kernal;
    })
  );

  loadMembers() {
    this.memberService.loadMembers();
  }
}
