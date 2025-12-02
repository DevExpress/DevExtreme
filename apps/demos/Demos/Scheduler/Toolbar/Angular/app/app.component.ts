import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, type DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular/ui/scheduler';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service } from './app.service';

const MS_IN_HOUR = 60 * 1000;

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
  @ViewChild(DxSchedulerComponent, { static: true }) scheduler: DxSchedulerComponent;

  dataSource = this.service.getAppointmentsDataSource();

  assignees = this.service.getAssignees();

  currentDate = this.service.getInitialCurrentDate();

  newEventButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    text: 'New Appointment',
    stylingMode: 'outlined',
    type: 'normal',
    onClick: () => { this.onAppointmentAdd(); },
  };

  constructor(private service: Service) {}

  onAppointmentAdd() {
    const selected = this.scheduler.instance.option('selectedCellData') ?? [];

    if (selected.length) {
      const firstSelected = selected[0];
      const lastSelected = selected.at(-1);

      this.scheduler.instance.showAppointmentPopup({
        ...firstSelected.groups,
        allDay: firstSelected.allDay,
        startDate: new Date(firstSelected.startDateUTC),
        endDate: new Date(lastSelected.endDateUTC),
      }, true);

      return;
    }

    const currentDate = this.scheduler.instance.option('currentDate');
    const cellDuration = this.scheduler.instance.option('cellDuration');
    const cellDurationMs = cellDuration * MS_IN_HOUR;
    const currentTime = new Date(currentDate as Date).getTime();
    const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

    this.scheduler.instance.showAppointmentPopup({
      startDate: new Date(roundTime),
      endDate: new Date(roundTime + cellDurationMs),
    }, true);
  }

  onAssigneesChange(event: DxSelectBoxTypes.ValueChangedEvent) {
    const dataSource = this.scheduler.instance.option('dataSource');
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

    dataSource.filter(filter);
    this.scheduler.instance.option('dataSource', dataSource);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxSchedulerModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
