import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { Appointment, Priority, Service } from './app.service';

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
  providers: [Service],
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2021, 3, 21);

  prioritiesData: Priority[];

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.prioritiesData = service.getPriorities();
  }

  onSelectionEnd(e) {
    const cells = e.selectedCellData;
    if (cells.length <= 1) {
      return;
    }

    const startDate = cells[0].startDateUTC || cells[0].startDate;
    const endDate = cells[cells.length - 1].endDateUTC || cells[cells.length - 1].endDate;

    e.component.showAppointmentPopup({
      startDate,
      endDate,
      allDay: cells[0].allDay,
      ...cells[0].groups,
    }, true);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
