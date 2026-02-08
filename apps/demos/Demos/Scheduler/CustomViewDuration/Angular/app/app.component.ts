import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2021, 3, 5);

  daysViewStartDate: Date = new Date(2021, 3, 4);

  weeksViewStartDate: Date = new Date(2021, 2, 4);

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
