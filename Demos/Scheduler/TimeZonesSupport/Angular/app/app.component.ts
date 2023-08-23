import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import timeZoneUtils, { dxSchedulerTimeZone } from 'devextreme/time_zone_utils';
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
  currentDate: Date = new Date(2021, 3, 27);

  currentTimeZone: string;

  locations: string[];

  dataSource: Data[];

  timeZones: dxSchedulerTimeZone[];

  service: Service;

  constructor(service: Service) {
    this.service = service;
    this.timeZones = this.getTimeZones(this.currentDate);
    this.dataSource = service.getData();
    this.currentTimeZone = this.timeZones[0].id;
    this.currentDate = this.currentDate;
  }

  getTimeZones(date: Date) {
    const timeZones = timeZoneUtils.getTimeZones(date);
    return timeZones.filter((timeZone) => this.service.getLocations().indexOf(timeZone.id) !== -1);
  }

  onValueChanged(e: any) {
    this.currentTimeZone = e.value;
  }

  onAppointmentFormOpening(e: any) {
    const form = e.form;

    const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
    const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
    const startDateDataSource = startDateTimezoneEditor.option('dataSource');
    const endDateDataSource = endDateTimezoneEditor.option('dataSource');

    startDateDataSource.filter(['id', 'contains', 'Europe']);
    endDateDataSource.filter(['id', 'contains', 'Europe']);

    startDateDataSource.load();
    endDateDataSource.load();
  }

  onOptionChanged(e) {
    if (e.name === 'currentDate') {
      this.timeZones = this.getTimeZones(e.value);
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
