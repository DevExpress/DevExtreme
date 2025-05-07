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
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxTagBoxModule, DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import {
  Appointment, Service, Assignee
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
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  dataSource: DataSource<Appointment>;

  assignees: Assignee[];

  currentDate: Date = new Date(2021, 3, 27);

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
  }

  onAssigneesChange(event: DxTagBoxTypes.ValueChangedEvent) {
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;
    this.dataSource.filter(filter);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
    DxTagBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
