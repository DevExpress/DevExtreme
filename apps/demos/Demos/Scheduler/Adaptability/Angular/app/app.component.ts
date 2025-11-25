import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { DxSpeedDialActionModule, DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular';
import { Appointment, Resource, Service } from './app.service';

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
    DxSpeedDialActionModule,
  ],
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  appointments: Appointment[];

  currentDate: Date = new Date(2021, 2, 25);

  cellDuration = 30;

  priorities: Resource[];

  constructor(service: Service) {
    this.appointments = service.getAppointments();
    this.priorities = service.getResources();
  }

  showAppointmentPopup() {
    this.scheduler.instance.showAppointmentPopup();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
