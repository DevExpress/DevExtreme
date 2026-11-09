import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly currentDate = new Date(2021, 3, 21);

  readonly prioritiesData = this.service.getPriorities();

  onSelectionEnd(e) {
    const cells = e.selectedCellData;
    if (cells.length <= 1) {
      return;
    }

    const startDate = cells[0].startDateUTC || cells[0].startDate;
    const endDate = cells[cells.length - 1].endDateUTC || cells[cells.length - 1].endDate;

    e.component.showAppointmentPopup({
      startDate,
      endDate,
      allDay: cells[0].allDay,
      ...cells[0].groups,
    }, true);
  }
}

bootstrapApplication(AppComponent);
