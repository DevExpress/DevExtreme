import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule } from 'devextreme-angular';
import {
  Appointment, Service, Priority, Assignee,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service],
})
export class AppComponent {
  appointmentsData: Appointment[];

  assignees: Assignee[];

  priorities: Priority[];

  currentDate: Date = new Date(2021, 4, 11);

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.assignees = service.getAssignees();
    this.priorities = service.getPriorities();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
