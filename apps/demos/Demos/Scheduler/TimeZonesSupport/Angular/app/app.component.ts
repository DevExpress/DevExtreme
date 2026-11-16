import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule } from 'devextreme-angular';
import { getTimeZones } from 'devextreme/time_zone_utils';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DataSource } from 'devextreme-angular/common/data';
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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getData();

  readonly currentDate = new Date(2021, 3, 27);

  readonly timeZones = signal(this.getDefaultTimeZones(this.currentDate));

  readonly currentTimeZone = signal(this.timeZones()[0].id);

  private getDefaultTimeZones(date: Date) {
    return getTimeZones(date, this.service.getLocations());
  }

  onAppointmentFormOpening({ form }: DxSchedulerTypes.AppointmentFormOpeningEvent) {
    const startDateDataSource = form.getEditor('startDateTimeZone').option('dataSource') as DataSource;
    const endDateDataSource = form.getEditor('endDateTimeZone').option('dataSource') as DataSource;

    startDateDataSource.filter(['id', 'contains', 'Europe']);
    endDateDataSource.filter(['id', 'contains', 'Europe']);

    startDateDataSource.load();
    endDateDataSource.load();
  }

  onOptionChanged({ name, value }: DxSchedulerTypes.OptionChangedEvent) {
    if (name === 'currentDate') {
      this.timeZones.set(this.getDefaultTimeZones(value));
    }
  }
}

bootstrapApplication(AppComponent);
