import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
import {
  Appointment, Service, Assignee, Room, Priority,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
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

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
