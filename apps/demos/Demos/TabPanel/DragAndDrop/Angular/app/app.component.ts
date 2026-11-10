import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxButtonModule, DxSortableModule, DxTabPanelModule, DxListModule,
} from 'devextreme-angular';
import type { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { type Employee, Service, type Task } from './app.service';

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
    DxButtonModule,
    DxSortableModule,
    DxTabPanelModule,
    DxListModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  private readonly allEmployees: Employee[] = this.service.getEmployees();

  readonly employees = signal<Employee[]>(this.service.getEmployees().slice(0, 3));

  readonly selectedIndex = signal(0);

  private readonly tasks: Task[] = this.service.getTasks();

  private readonly tasksDataSourceStorage: { key: number, dataSourceInstance: Task[] }[] = [];

  readonly showCloseButton = computed(() => this.employees().length > 1);

  readonly disableButton = computed(() => this.employees().length === this.allEmployees.length);

  onTabDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop(e: DxSortableTypes.ReorderEvent) {
    const employees = [...this.employees()];
    employees.splice(e.fromIndex, 1);
    employees.splice(e.toIndex, 0, e.itemData);
    this.employees.set(employees);
  }

  addButtonHandler() {
    const employees = this.employees();
    const newItem = this.allEmployees.filter((employee) => employees.indexOf(employee) === -1)[0];

    this.selectedIndex.set(employees.length);
    this.employees.set([...employees, newItem]);
  }

  closeButtonHandler(itemData: Employee) {
    const employees = [...this.employees()];
    const index = employees.indexOf(itemData);

    employees.splice(index, 1);
    this.employees.set(employees);
    if (index >= employees.length && index > 0) this.selectedIndex.set(index - 1);
  }

  getTasks(id: number) {
    let item = this.tasksDataSourceStorage.find(
      (i) => i.key === id,
    );

    if (!item) {
      item = {
        key: id,
        dataSourceInstance: this.tasks.filter((task) => task.EmployeeID === id),
      };

      this.tasksDataSourceStorage.push(item);
    }

    return item.dataSourceInstance;
  }

  getCompletedTasks(id: number) {
    return this.tasks.filter((task) => task.EmployeeID === id).filter((task) => task.Status === 'Completed');
  }
}

bootstrapApplication(AppComponent);
