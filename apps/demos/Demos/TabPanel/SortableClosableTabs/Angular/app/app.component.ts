import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxButtonModule, DxSortableModule, DxTabPanelModule, DxListModule, DxTemplateModule,
} from 'devextreme-angular';
import { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { Employee, Service, Task } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  allEmployees: Employee[];

  employees: Employee[];

  selectedIndex: number;

  tasks: Task[];

  tasksDataSourceStorage: { key: number, dataSourceInstance: Task[] }[] = [];

  constructor(private service: Service) {
    this.allEmployees = service.getEmployees();
    this.employees = service.getEmployees().slice(0, 3);
    this.selectedIndex = 0;
    this.tasks = service.getTasks();
  }

  onTabDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop(e: DxSortableTypes.ReorderEvent) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  addButtonHandler() {
    const newItem = this.allEmployees.filter((employee) => this.employees.indexOf(employee) === -1)[0];

    this.selectedIndex = this.employees.length;
    this.employees.push(newItem);
  }

  closeButtonHandler(itemData: Employee) {
    const index = this.employees.indexOf(itemData);

    this.employees.splice(index, 1);
    if (index >= this.employees.length && index > 0) this.selectedIndex = index - 1;
  }

  showCloseButton() {
    return this.employees.length > 1;
  }

  disableButton() {
    return this.employees.length === this.allEmployees.length;
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

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxSortableModule,
    DxTabPanelModule,
    DxListModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
