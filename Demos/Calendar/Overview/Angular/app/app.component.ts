import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxCheckBoxModule, DxDateBoxModule, DxSelectBoxModule, DxTemplateModule,
} from 'devextreme-angular';
import { DxCalendarModule, DxCalendarTypes } from 'devextreme-angular/ui/calendar';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  now = new Date();

  currentValue = new Date();

  zoomLevels: DxCalendarTypes.CalendarZoomLevel[] = [
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

  weekNumberRules: DxCalendarTypes.WeekNumberRule[] = [
    'auto', 'firstDay', 'firstFourDays', 'fullWeek',
  ];

  cellTemplate = 'cell';

  holidays = [[1, 0], [4, 6], [25, 11]];

  isWeekend(date: Date) {
    const day = date.getDay();

    return day === 0 || day === 6;
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
    DxCalendarModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
