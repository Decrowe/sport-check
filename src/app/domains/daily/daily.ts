import { Component, OnInit, viewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { Exercises, MemberStates } from '@domains/daily/features';

@Component({
  selector: 'app-daily',
  imports: [Exercises, MemberStates, MatDividerModule, MatExpansionModule],
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
})
export class Daily implements OnInit {
  readonly exercisesPanel = viewChild.required(MatExpansionPanel);

  ngOnInit() {
    this.exercisesPanel().expanded = false;
  }
}
