import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSpeedDialActionModule, DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular';
import { Appointment, Resource, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxSpeedDialActionModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
