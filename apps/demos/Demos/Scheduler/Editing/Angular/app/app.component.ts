import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxCheckBoxModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { Appointment, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2021, 3, 29);

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }

  showToast(event: string, value: string, type: string) {
    notify(`${event} "${value}"` + ' task', type, 800);
  }

  onAppointmentAdded(e: DxSchedulerTypes.AppointmentAddedEvent) {
    this.showToast('Added', e.appointmentData.text, 'success');
  }

  onAppointmentUpdated(e: DxSchedulerTypes.AppointmentUpdatedEvent) {
    this.showToast('Updated', e.appointmentData.text, 'info');
  }

  onAppointmentDeleted(e: DxSchedulerTypes.AppointmentDeletedEvent) {
    this.showToast('Deleted', e.appointmentData.text, 'warning');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
