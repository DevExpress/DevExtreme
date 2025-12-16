import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxDraggableTypes } from 'devextreme-angular/ui/draggable';
import { Appointment, Task, Service } from './app.service';

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
  imports: [
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
  ],
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

  onListDragStart(e: DxDraggableTypes.DragStartEvent) {
    e.cancel = true;
  }

  onItemDragStart(e: DxDraggableTypes.DragStartEvent) {
    e.itemData = e.fromData;
  }

  onItemDragEnd(e: DxDraggableTypes.DragEndEvent) {
    if (e.toData) {
      e.cancel = true;
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
