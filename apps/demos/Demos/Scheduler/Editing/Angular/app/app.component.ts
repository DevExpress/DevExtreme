import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule, DxCheckBoxModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxSchedulerModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly appointmentsData = inject(Service).getAppointments();

  readonly currentDate = new Date(2021, 3, 29);

  private showToast(event: string, value: string, type: string) {
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

bootstrapApplication(AppComponent);
