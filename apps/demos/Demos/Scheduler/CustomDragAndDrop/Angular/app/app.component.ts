import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { Appointment, Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  draggingGroupName = 'appointmentsGroup';

  tasks: Task[];

  appointments: Appointment[];

  currentDate: Date = new Date(2021, 3, 26);

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.appointments = service.getAppointments();
  }

  onAppointmentRemove = (e: DxSchedulerTypes.AppointmentDraggingRemoveEvent) => {
    const index = this.appointments.indexOf(e.itemData);

    if (index >= 0) {
      this.appointments.splice(index, 1);
      this.tasks.push(e.itemData);
    }
  };

  onAppointmentAdd = (e: DxSchedulerTypes.AppointmentDraggingAddEvent) => {
    const index = this.tasks.indexOf(e.fromData);

    if (index >= 0) {
      this.tasks.splice(index, 1);
      this.appointments.push(e.itemData);
    }
  };

  onListDragStart(e: DxSchedulerTypes.AppointmentDraggingStartEvent) {
    e.cancel = true;
  }

  onItemDragStart(e: DxSchedulerTypes.AppointmentDraggingStartEvent) {
    Object.assign(e.itemData, e.fromData);
  }

  onItemDragEnd(e: DxSchedulerTypes.AppointmentDraggingEndEvent) {
    if (e.toData) {
      e.cancel = true;
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
