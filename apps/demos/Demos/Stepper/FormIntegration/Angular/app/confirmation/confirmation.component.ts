import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { BookingFormData } from '../app.types';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  @Input() formData: BookingFormData;

  @Input() isConfirmed: boolean;

  getCheckInDate() {
    return new Date(this.formData.dates[0]).toLocaleDateString();
  }

  getCheckOutDate() {
    return new Date(this.formData.dates[1]).toLocaleDateString();
  }
}
