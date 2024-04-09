import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { getTimeZones, dxSchedulerTimeZone } from 'devextreme/time_zone_utils';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import DataSource from 'devextreme/data/data_source';
import { Service, Data } from './app.service';

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
  locations: string[];

  dataSource: Data[];

  service: Service;

  currentDate: Date = new Date(2021, 3, 27);

  timeZones: dxSchedulerTimeZone[] = [];

  currentTimeZone = '';

  constructor(service: Service) {
    this.service = service;
    this.dataSource = service.getData();
    this.timeZones = this.getDefaultTimeZones(this.currentDate);
    this.currentTimeZone = this.timeZones[0].id;
  }

  getDefaultTimeZones = (date: Date) => getTimeZones(date).filter((timeZone) => this.service.getLocations().indexOf(timeZone.id) !== -1);

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
      this.timeZones = this.getDefaultTimeZones(value);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxTemplateModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
