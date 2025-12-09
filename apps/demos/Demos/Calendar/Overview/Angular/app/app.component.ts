import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxCheckBoxModule, DxDateBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import { DxCalendarModule, DxCalendarTypes } from 'devextreme-angular/ui/calendar';

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
    DxCalendarModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
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

  isHoliday(date: Date) {
    return this.holidays.some((item) => date.getDate() === item[0] && date.getMonth() === item[1]);
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

        if (this.isHoliday(date)) { cssClass = 'holiday'; }
      }
    }

    return cssClass;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
