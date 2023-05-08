import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxDateBoxModule,
  DxCalendarModule,
  DxTemplateModule,
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  now: Date = new Date();

  currentValue: Date = new Date();

  minDateValue: Date | null = null;

  maxDateValue: Date | null = null;

  disabledDates: Function | null = null;

  zoomLevels: string[] = [
    'month', 'year', 'decade', 'century',
  ];

  weekDays: { id: number; text: string }[] = [
    { id: 0, text: 'Sunday' },
    { id: 1, text: 'Monday' },
    { id: 2, text: 'Tuesday' },
    { id: 3, text: 'Wednesday' },
    { id: 4, text: 'Thursday' },
    { id: 5, text: 'Friday' },
    { id: 6, text: 'Saturday' },
  ];

  weekNumberRules: string[] = [
    'auto', 'firstDay', 'firstFourDays', 'fullWeek',
  ];

  cellTemplate = 'cell';

  holidays: any = [[1, 0], [4, 6], [25, 11]];

  isWeekend(date) {
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
      ? (data) => data.view === 'month' && this.isWeekend(data.date)
      : null;
  }

  useCellTemplate({ value }) {
    this.cellTemplate = value ? 'custom' : 'cell';
  }

  getCellCssClass({ date, view }) {
    let cssClass = '';

    if (view === 'month') {
      if (!date) {
        cssClass = 'week-number';
      } else {
        if (this.isWeekend(date)) { cssClass = 'weekend'; }

        this.holidays.forEach((item) => {
          if (date.getDate() === item[0] && date.getMonth() === item[1]) {
            cssClass = 'holiday';
            return false;
          }
        });
      }
    }

    return cssClass;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSelectBoxModule,
    DxCalendarModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
