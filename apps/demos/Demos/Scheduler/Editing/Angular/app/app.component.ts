import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxCheckBoxModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
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
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxSchedulerModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2021, 3, 29);

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }

  showToast(event: string, value: string, type: string) {
    notify(`${event} "${value}" task`, type, 800);
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
