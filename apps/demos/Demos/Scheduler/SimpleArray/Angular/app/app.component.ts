import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { Appointment, Service } from './app.service';

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

  currentDate: Date = new Date(2021, 2, 28);

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
