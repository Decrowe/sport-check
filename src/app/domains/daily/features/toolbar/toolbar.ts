import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExersiceService } from '@domains/daily/services';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  readonly exerciseService = inject(ExersiceService);

  readonly date = this.exerciseService.date;

  onDateChanged($event: Date) {
    this.exerciseService.setDate($event);
  }

  goToNextDay() {
    const currentDate = new Date(this.exerciseService.date());
    if (currentDate) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      this.exerciseService.setDate(nextDay);
    }
  }

  goToPrevDay() {
    const currentDate = new Date(this.exerciseService.date());
    if (currentDate) {
      const prevDay = new Date(currentDate);
      prevDay.setDate(currentDate.getDate() - 1);
      this.exerciseService.setDate(prevDay);
    }
  }
}
