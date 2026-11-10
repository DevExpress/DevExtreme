import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, signal, viewChild,
} from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { DxCalendarComponent, DxCalendarModule, type DxCalendarTypes } from 'devextreme-angular/ui/calendar';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxSelectBoxModule,
    DxCalendarModule,
    DxCheckBoxModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  private readonly calendar = viewChild.required(DxCalendarComponent);

  private readonly now = new Date();

  readonly value = [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24)];

  readonly selectionModes: DxCalendarTypes.CalendarSelectionMode[] = [
    'single', 'multiple', 'range',
  ];

  readonly selectionMode = signal<DxCalendarTypes.CalendarSelectionMode>('multiple');

  readonly minDateValue = signal<Date | null>(null);

  readonly maxDateValue = signal<Date | null>(null);

  readonly disabledDates = signal<Function | null>(null);

  private isWeekend(date: Date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  setMinDate({ value }) {
    this.minDateValue.set(value
      ? new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 3)
      : null);
  }

  setMaxDate({ value }) {
    this.maxDateValue.set(value
      ? new Date(this.now.getTime() + 1000 * 60 * 60 * 24 * 3)
      : null);
  }

  disableWeekend({ value }) {
    this.disabledDates.set(value
      ? (data: { view: string, date: Date }) => data.view === 'month' && this.isWeekend(data.date)
      : null);
  }

  clearValue() {
    this.calendar().instance.clear();
  }
}

bootstrapApplication(AppComponent);
