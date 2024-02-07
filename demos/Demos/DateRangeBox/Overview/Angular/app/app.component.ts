import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDateRangeBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
