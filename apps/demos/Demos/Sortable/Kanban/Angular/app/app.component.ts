import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxScrollViewModule, DxSortableModule } from 'devextreme-angular';
import type { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { type Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxScrollViewModule,
    DxSortableModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly statuses = signal(['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed']);

  readonly employees: Record<number, string> = Object.fromEntries(
    this.service.getEmployees().map((employee) => [employee.ID, employee.Name]),
  );

  readonly lists = signal<Task[][]>(this.statuses().map(
    (status) => this.service.getTasks().filter((task) => task.Task_Status === status),
  ));

  onListReorder(e: DxSortableTypes.ReorderEvent) {
    this.lists.update((lists) => AppComponent.moveItem(lists, e.fromIndex, e.toIndex));
    this.statuses.update((statuses) => AppComponent.moveItem(statuses, e.fromIndex, e.toIndex));
  }

  onTaskDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTaskDrop(e: DxSortableTypes.AddEvent | DxSortableTypes.ReorderEvent) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.lists.update((lists) => [...lists]);
  }

  private static moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
    const result = [...items];
    const [item] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, item);
    return result;
  }
}

bootstrapApplication(AppComponent);
