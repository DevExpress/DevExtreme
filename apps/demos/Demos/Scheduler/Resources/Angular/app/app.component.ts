import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
import {
  Appointment, Service, Assignee, Room, Priority,
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
  imports: [
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  assignees: Assignee[];

  rooms: Room[];

  priorities: Priority[];

  resourcesList: string[] = ['Assignee', 'Room', 'Priority'];

  currentDate: Date = new Date(2021, 3, 27);

  currentResource: string = this.resourcesList[0];

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.assignees = service.getAssignees();
    this.rooms = service.getRooms();
    this.priorities = service.getPriorities();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
