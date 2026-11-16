import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
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

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxDateRangeBoxModule,
  ],
})

export class AppComponent {
  readonly currentValue = signal<[Date, Date]>(initialValue);

  readonly initialValue = initialValue;

  private readonly lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  readonly min = new Date(now.setDate(1));

  readonly max = new Date(now.setDate(this.lastDay));

  readonly selectedDays = signal(convertRangeToDays(initialValue));

  currentValueChanged({ value: [startDate, endDate] }) {
    let daysCount = 0;

    if (startDate && endDate) {
      daysCount = convertRangeToDays([startDate, endDate]);
    }

    this.selectedDays.set(daysCount);
  }
}

bootstrapApplication(AppComponent);
