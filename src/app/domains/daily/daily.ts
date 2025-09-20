import { Component } from '@angular/core';
import { Exercises, MemberStates } from '@domains/daily/features';

@Component({
  selector: 'app-daily',
  imports: [Exercises, MemberStates],
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
})
export class Daily {}
