

import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxButtonModule, DxSortableModule, DxTabPanelModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { Employee, Service, Task } from './app.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true
})

export class AppComponent {
  allEmployees: Employee[];
  employees: Employee[];
  selectedItem: Employee;
  selectedIndex: number;
  isAddButtonDisabled: boolean;
  isRemoveButtonDisabled: boolean;
  tasks: Task[];
  tasksDataSourceStorage: any;

  constructor(private service: Service) {
    this.allEmployees = service.getEmployees();
    this.employees = service.getEmployees().slice(0, 3);
    this.selectedItem = this.employees[0];
    this.selectedIndex = 0;
    this.isAddButtonDisabled = false;
    this.isRemoveButtonDisabled = false;
    this.tasks = service.getTasks();
    this.tasksDataSourceStorage = [];
  }

  onTabDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop(e) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  addButtonHandler() {
    const newItem = this.allEmployees.filter(employee => this.employees.indexOf(employee) === -1)[0];

    this.employees.push(newItem);
    this.selectedItem = newItem;

    this.updateButtonsAppearance();
  }

  closeButtonHandler(itemData) {
    if(!itemData) return;
    const index = this.employees.indexOf(itemData);

    this.employees.splice(index, 1);
    if(index >= this.employees.length && index > 0) this.selectedIndex = index - 1;

    this.updateButtonsAppearance();
  }

  updateButtonsAppearance() {
    this.isAddButtonDisabled = this.employees.length === this.allEmployees.length;
    this.isRemoveButtonDisabled = this.employees.length === 0;
  }

  completedValue(rowData) {
    return rowData.Status == "Completed";
  }

  getTasks(key) {
    let item = this.tasksDataSourceStorage.find((i) => i.key === key);
    if (!item) {
      item = {
        key: key,
        dataSourceInstance: new DataSource({
          store: new ArrayStore({
            data: this.tasks,
            key: "ID"
          }),
          filter: ["EmployeeID", "=", key]
        })
      };
      this.tasksDataSourceStorage.push(item)
    }
    return item.dataSourceInstance;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxSortableModule,
    DxTabPanelModule,
    DxDataGridModule,
    DxTemplateModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);