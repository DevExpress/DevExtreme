import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxButtonModule, type DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular/ui/scheduler';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service } from './app.service';

const MS_IN_HOUR = 60 * 1000;

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxButtonModule,
    DxSchedulerModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly scheduler = viewChild.required(DxSchedulerComponent);

  private readonly service = inject(Service);

  readonly dataSource = this.service.getAppointmentsDataSource();

  readonly assignees = this.service.getAssignees();

  readonly currentDate = this.service.getInitialCurrentDate();

  readonly newEventButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    text: 'New Appointment',
    stylingMode: 'outlined',
    type: 'normal',
    onClick: () => { this.onAppointmentAdd(); },
  };

  private onAppointmentAdd() {
    const selected = this.scheduler().instance.option('selectedCellData') ?? [];

    if (selected.length) {
      const firstSelected = selected[0];
      const lastSelected = selected.at(-1);

      this.scheduler().instance.showAppointmentPopup({
        ...firstSelected.groups,
        allDay: firstSelected.allDay,
        startDate: new Date(firstSelected.startDateUTC),
        endDate: new Date(lastSelected.endDateUTC),
      }, true);

      return;
    }

    const currentDate = this.scheduler().instance.option('currentDate');
    const cellDuration = this.scheduler().instance.option('cellDuration');
    const cellDurationMs = cellDuration * MS_IN_HOUR;
    const currentTime = new Date(currentDate as Date).getTime();
    const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

    this.scheduler().instance.showAppointmentPopup({
      startDate: new Date(roundTime),
      endDate: new Date(roundTime + cellDurationMs),
    }, true);
  }

  onAssigneesChange(event: DxSelectBoxTypes.ValueChangedEvent) {
    const dataSource = this.scheduler().instance.option('dataSource');
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

    dataSource.filter(filter);
    this.scheduler().instance.option('dataSource', dataSource);
  }
}

bootstrapApplication(AppComponent);
