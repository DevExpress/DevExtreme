import { Component, computed, input } from '@angular/core';
import type { BookingFormData } from '../app.types';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  readonly formData = input.required<BookingFormData>();

  readonly isConfirmed = input.required<boolean>();

  readonly checkInDate = computed(() => new Date(this.formData().dates[0]).toLocaleDateString());

  readonly checkOutDate = computed(() => new Date(this.formData().dates[1]).toLocaleDateString());
}
