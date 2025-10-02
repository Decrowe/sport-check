import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProgressService } from '@domains/daily/services';

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
  readonly progressService = inject(ProgressService);

  readonly date = this.progressService.date;

  onDateChanged($event: Date) {
    this.progressService.setDate($event);
  }

  goToNextDay() {
    const currentDate = new Date(this.progressService.date());
    if (currentDate) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      this.progressService.setDate(nextDay);
    }
  }

  goToPrevDay() {
    const currentDate = new Date(this.progressService.date());
    if (currentDate) {
      const prevDay = new Date(currentDate);
      prevDay.setDate(currentDate.getDate() - 1);
      this.progressService.setDate(prevDay);
    }
  }
}
