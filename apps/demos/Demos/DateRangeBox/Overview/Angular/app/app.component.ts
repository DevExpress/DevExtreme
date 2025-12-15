import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDateRangeBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();
const initialValue: [Date, Date] = [
  new Date(now.getTime() - msInDay * 3),
  new Date(now.getTime() + msInDay * 3),
];

function convertRangeToDays([startDate, endDate]) {
  const diffInDay = Math.floor(Math.abs((endDate - startDate) / msInDay));

  return diffInDay + 1;
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
    DxDateRangeBoxModule,
  ],
})

export class AppComponent {
  currentValue: [Date, Date] = initialValue;

  initialValue: [Date, Date] = initialValue;

  min: Date = null;

  max: Date = null;

  selectedDays: number = convertRangeToDays(initialValue);

  constructor() {
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    this.min = new Date(now.setDate(1));
    this.max = new Date(now.setDate(lastDay));
  }

  currentValueChanged({ value: [startDate, endDate] }) {
    let daysCount = 0;

    if (startDate && endDate) {
      daysCount = convertRangeToDays([startDate, endDate]);
    }

    this.selectedDays = daysCount;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
