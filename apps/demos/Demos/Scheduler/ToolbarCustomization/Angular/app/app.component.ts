import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSchedulerModule,
  DxSchedulerComponent,
  DxTemplateModule,
  DxButtonModule,
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import {
  Service, Assignee
} from './app.service';

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
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  dataSource: DataSource;

  assignees: Assignee[];

  currentDate: Date;

  newEventButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    text: 'New Appointment',
    stylingMode: 'outlined',
    type: 'normal',
    onClick: () => {
      const selected = this.scheduler.instance.option('selectedCellData') ?? [];

      if (selected.length) {
        this.scheduler.instance.showAppointmentPopup({
          ...selected[0].groups,
          allDay: selected[0].allDay,
          startDate: new Date(selected[0].startDateUTC),
          endDate: new Date(selected.at(-1).endDateUTC),
        }, true);
      } else {
        const currentDate = this.scheduler.instance.option('currentDate');
        const cellDuration = this.scheduler.instance.option('cellDuration') as number;
        const cellDurationMs = cellDuration * 60 * 1000; // ms
        const currentTime = new Date(currentDate as Date).getTime();
        const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

        this.scheduler.instance.showAppointmentPopup({
          startDate: new Date(roundTime),
          endDate: new Date(roundTime + cellDurationMs),
        }, true);
      }
    },
  };

  constructor(service: Service) {
    this.dataSource = service.getAppointmentsDataSource();
    this.assignees = service.getAssignees();
    this.currentDate = service.getInitialCurrentDate();
  }

  onAssigneesChange(event: DxSelectBoxTypes.ValueChangedEvent) {
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;
    this.dataSource.filter(filter);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
