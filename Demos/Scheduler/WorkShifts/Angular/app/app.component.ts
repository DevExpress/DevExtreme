import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
import { Service, Appointment, Shift } from './app.service';

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
  appointments: Appointment[];

  shifts: Shift[];

  currentShift:Shift;

  currentDate: Date = new Date(2021, 2, 30);

  constructor(service: Service) {
    this.appointments = service.getAppointments();
    this.shifts = service.getShifts();

    this.currentShift = this.shifts[0];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
