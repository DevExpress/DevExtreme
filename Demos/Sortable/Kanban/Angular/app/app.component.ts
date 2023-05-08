import {
  NgModule, Component, ViewChild, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxScrollViewModule, DxSortableModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  lists: any[] = [];

  statuses: string[] = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];

  employees: Object = {};

  constructor(service: Service) {
    const tasks = service.getTasks();

    service.getEmployees().forEach((employee) => {
      this.employees[employee.ID] = employee.Name;
    });

    this.statuses.forEach((status) => {
      this.lists.push(tasks.filter((task) => task.Task_Status === status));
    });
  }

  onListReorder(e) {
    const list = this.lists.splice(e.fromIndex, 1)[0];
    this.lists.splice(e.toIndex, 0, list);

    const status = this.statuses.splice(e.fromIndex, 1)[0];
    this.statuses.splice(e.toIndex, 0, status);
  }

  onTaskDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTaskDrop(e) {
    e.fromData.splice(e.fromIndex, 1);
    e.toData.splice(e.toIndex, 0, e.itemData);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxScrollViewModule,
    DxSortableModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
