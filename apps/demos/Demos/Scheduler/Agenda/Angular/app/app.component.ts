import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule } from 'devextreme-angular';
import ArrayStore from "devextreme/data/array_store"
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
    })
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
