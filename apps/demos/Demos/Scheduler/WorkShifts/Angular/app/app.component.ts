import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
import { Service, Appointment, Shift } from './app.service';

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
  providers: [Service],
  imports: [
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  appointments: Appointment[];

  shifts: Shift[];

  currentShift: Shift;

  currentDate: Date = new Date(2021, 2, 30);

  constructor(service: Service) {
    this.appointments = service.getAppointments();
    this.shifts = service.getShifts();

    this.currentShift = this.shifts[0];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
