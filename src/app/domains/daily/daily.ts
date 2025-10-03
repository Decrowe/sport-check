import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-daily',
  imports: [MatExpansionModule, RouterOutlet],
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
})
export class Daily {}
