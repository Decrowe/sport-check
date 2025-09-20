import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Exercises, MemberStates } from '@domains/daily-challange/features';

@Component({
  selector: 'app-daily-challange',
  imports: [Exercises, MemberStates],
  templateUrl: './daily-challange.html',
  styleUrl: './daily-challange.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyChallange {}
