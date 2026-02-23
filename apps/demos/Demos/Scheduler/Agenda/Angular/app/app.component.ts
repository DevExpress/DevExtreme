import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import {
  Service, Priority, Assignee,
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
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  appointmentsData: ArrayStore;

  assignees: Assignee[];

  priorities: Priority[];

  currentDate: Date = new Date(2021, 4, 11);

  constructor(service: Service) {
    this.assignees = service.getAssignees();
    this.priorities = service.getPriorities();

    this.appointmentsData = new ArrayStore({
      key: 'id',
      data: service.getAppointments(),
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
