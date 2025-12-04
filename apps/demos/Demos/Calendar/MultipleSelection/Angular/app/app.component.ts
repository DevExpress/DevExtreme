import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { DxCalendarComponent, DxCalendarModule, DxCalendarTypes } from 'devextreme-angular/ui/calendar';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxSelectBoxModule,
    DxCalendarModule,
    DxCheckBoxModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  @ViewChild(DxCalendarComponent, { static: false }) calendar: DxCalendarComponent;

  now = new Date();

  value = [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24)];

  selectionModes: DxCalendarTypes.CalendarSelectionMode[] = [
    'single', 'multiple', 'range',
  ];

  selectionMode: DxCalendarTypes.CalendarSelectionMode = 'multiple';

  minDateValue: Date | null = null;

  maxDateValue: Date | null = null;

  disabledDates: Function | null = null;

  isWeekend(date: Date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  setMinDate({ value }) {
    this.minDateValue = value
      ? new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 3)
      : null;
  }

  setMaxDate({ value }) {
    this.maxDateValue = value
      ? new Date(this.now.getTime() + 1000 * 60 * 60 * 24 * 3)
      : null;
  }

  disableWeekend({ value }) {
    this.disabledDates = value
      ? (data: { view: string, date: Date }) => data.view === 'month' && this.isWeekend(data.date)
      : null;
  }

  clearValue() {
    this.calendar.instance.clear();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
