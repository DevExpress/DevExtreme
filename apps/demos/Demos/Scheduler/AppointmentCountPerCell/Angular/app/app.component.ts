import { bootstrapApplication } from '@angular/platform-browser';
import {
  ViewChild, Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular';
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
  providers: [Service],
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  appointmentsData: Appointment[];

  currentDate: Date = new Date(2021, 2, 25);

  resourcesData: Resource[];

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.resourcesData = service.getResources();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
