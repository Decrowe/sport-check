import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[confirmClick]',
  standalone: true,
})
export class ConfirmClickDirective {
  @Input() confirmTitle?: string;
  @Input() confirmMessage?: string;
  @Input() confirmConfirmLabel?: string;
  @Input() confirmCancelLabel?: string;
  @Input() confirmDanger: boolean = false;

  // When confirmation succeeds
  @Output() confirmed = new EventEmitter<void>();
  // Emits the boolean dialog result (true/false) for advanced use cases
  @Output() confirmedResult = new EventEmitter<boolean>();

  private busy = false;

  constructor(private dialog: MatDialog) {}

  @HostListener('click', ['$event'])
  onHostClicked(event: Event) {
    // Avoid recursive dialogs or multiple rapid clicks
    if (this.busy) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Let modifier key / middle clicks pass through (e.g., open in new tab semantics)
    if (
      (event as MouseEvent).metaKey ||
      (event as MouseEvent).ctrlKey ||
      (event as MouseEvent).button === 1
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const data: ConfirmDialogData = {
      title: this.confirmTitle,
      message: this.confirmMessage,
      confirmLabel: this.confirmConfirmLabel,
      cancelLabel: this.confirmCancelLabel,
      danger: this.confirmDanger,
    };

    this.busy = true;
    const ref = this.dialog.open(ConfirmDialogComponent, { data });
    ref.afterClosed().subscribe((result) => {
      this.busy = false;
      this.confirmedResult.emit(result === true);
      if (result === true) {
        this.confirmed.emit();
      }
    });
  }
}
