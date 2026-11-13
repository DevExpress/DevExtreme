import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxListModule } from 'devextreme-angular';
import type { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { type Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type DxoItemDraggingProperties = DxSortableTypes.Properties;

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [DxListModule],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly doingTasks = signal<Task[]>(this.service.getDoingTasks());

  readonly plannedTasks = signal<Task[]>(this.service.getPlannedTasks());

  onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  };

  onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
    this.getTasks(e.toData).update((tasks) => {
      const result = [...tasks];
      result.splice(e.toIndex, 0, e.itemData);
      return result;
    });
  };

  onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
    this.getTasks(e.fromData).update((tasks) => {
      const result = [...tasks];
      result.splice(e.fromIndex, 1);
      return result;
    });
  };

  onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
    this.getTasks(e.fromData).update((tasks) => {
      const result = [...tasks];
      result.splice(e.fromIndex, 1);
      result.splice(e.toIndex, 0, e.itemData);
      return result;
    });
  };

  private getTasks(data: Task[]) {
    return data === this.plannedTasks() ? this.plannedTasks : this.doingTasks;
  }
}

bootstrapApplication(AppComponent);
