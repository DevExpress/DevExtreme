import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DxDraggableTypes } from 'devextreme-angular/ui/draggable';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxSchedulerModule,
    DxDraggableModule,
    DxScrollViewModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly draggingGroupName = 'appointmentsGroup';

  readonly tasks = signal(this.service.getTasks());

  readonly appointments = signal(this.service.getAppointments());

  readonly currentDate = new Date(2021, 3, 26);

  onAppointmentRemove = (e: DxSchedulerTypes.AppointmentDraggingRemoveEvent) => {
    if (this.appointments().includes(e.itemData)) {
      this.appointments.update((items) => items.filter((item) => item !== e.itemData));
      this.tasks.update((items) => [...items, e.itemData]);
    }
  };

  onAppointmentAdd = (e: DxSchedulerTypes.AppointmentDraggingAddEvent) => {
    if (this.tasks().includes(e.fromData)) {
      this.tasks.update((items) => items.filter((item) => item !== e.fromData));
      this.appointments.update((items) => [...items, e.itemData]);
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

bootstrapApplication(AppComponent);
