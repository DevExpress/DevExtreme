import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { ArrayStore } from 'devextreme-angular/common/data';
import { DataService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

interface DayLabel {
  index: DxSchedulerTypes.DayOfWeek;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [DataService],
  imports: [
    DxSchedulerModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  dataSource: ArrayStore;

  currentDate = new Date(2021, 3, 26);

  validationMessage = 'The hiddenWeekDays option cannot hide all days of the week. At least one day must remain visible.';

  dayLabels: DayLabel[] = [
    { index: 0, label: 'Sunday', visible: true },
    { index: 1, label: 'Monday', visible: true },
    { index: 2, label: 'Tuesday', visible: true },
    { index: 3, label: 'Wednesday', visible: false },
    { index: 4, label: 'Thursday', visible: true },
    { index: 5, label: 'Friday', visible: false },
    { index: 6, label: 'Saturday', visible: true },
  ];

  hiddenWeekDays: DxSchedulerTypes.DayOfWeek[] = [];

  isInvalid = false;

  constructor(dataService: DataService) {
    this.dataSource = new ArrayStore({
      key: 'id',
      data: dataService.getAppointments(),
    });
    this.hiddenWeekDays = this.computeHiddenWeekDays();
  }

  onDayToggled(e: DxCheckBoxTypes.ValueChangedEvent, dayIndex: number): void {
    this.dayLabels[dayIndex].visible = e.value;
    this.isInvalid = this.dayLabels.every((d) => !d.visible);
    this.hiddenWeekDays = this.computeHiddenWeekDays();
  }

  private computeHiddenWeekDays(): DxSchedulerTypes.DayOfWeek[] {
    return this.dayLabels
      .filter((d) => !d.visible)
      .map((d) => d.index);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
