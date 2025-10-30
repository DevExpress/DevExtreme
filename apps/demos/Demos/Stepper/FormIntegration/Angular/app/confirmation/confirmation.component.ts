import { Component, Input } from '@angular/core';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'confirmation',
  standalone: false,
  templateUrl: `.${modulePrefix}/confirmation/confirmation.component.html`,
  styleUrls: [`.${modulePrefix}/confirmation/confirmation.component.css`],
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
