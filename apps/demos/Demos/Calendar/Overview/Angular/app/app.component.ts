import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import {
  DxCheckBoxModule, DxDateBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import { DxCalendarModule, type DxCalendarTypes } from 'devextreme-angular/ui/calendar';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCalendarModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly now = new Date();

  readonly currentValue = signal(new Date());

  readonly zoomLevels: DxCalendarTypes.CalendarZoomLevel[] = [
    'month', 'year', 'decade', 'century',
  ];

  readonly zoomLevel = signal(this.zoomLevels[0]);

  readonly weekDays: { id: number; text: string }[] = [
    { id: 0, text: 'Sunday' },
    { id: 1, text: 'Monday' },
    { id: 2, text: 'Tuesday' },
    { id: 3, text: 'Wednesday' },
    { id: 4, text: 'Thursday' },
    { id: 5, text: 'Friday' },
    { id: 6, text: 'Saturday' },
  ];

  readonly weekNumberRules: DxCalendarTypes.WeekNumberRule[] = [
    'auto', 'firstDay', 'firstFourDays', 'fullWeek',
  ];

  readonly cellTemplate = signal('cell');

  private readonly holidays = [[1, 0], [4, 6], [25, 11]];

  private isWeekend(date: Date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  private isHoliday(date: Date) {
    return this.holidays.some((item) => date.getDate() === item[0] && date.getMonth() === item[1]);
  }

  useCellTemplate({ value }) {
    this.cellTemplate.set(value ? 'custom' : 'cell');
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

bootstrapApplication(AppComponent);
