import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxSchedulerModule } from 'devextreme-angular';
import { Resource, Appointment, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  resources: Resource[];

  appointments: Appointment[];

  currentDate: Date = new Date(2021, 1, 2);

  constructor(service: Service) {
    const startDay = new Date(2021, 1, 1);
    const endDay = new Date(2021, 1, 28);
    const startDayHour = 8;
    const endDayHour = 20;

    this.appointments = service.generateAppointments(startDay, endDay, startDayHour, endDayHour);

    this.resources = service.resources;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
