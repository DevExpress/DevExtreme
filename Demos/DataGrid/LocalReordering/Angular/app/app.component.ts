import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import {
  Service, Employee, Task, Status,
} from './app.service';

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
  tasks: Array<Task>;

  employees: Array<Employee>;

  statuses: Array<Status>;

  showDragIcons = true;

  constructor(service: Service) {
    this.tasks = service.getTasks();

    this.employees = service.getEmployees();

    this.statuses = service.getStatuses();
  }

  onReorder = (e: Parameters<DxDataGridTypes.RowDragging['onReorder']>[0]) => {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = this.tasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
    const fromIndex = this.tasks.findIndex((item) => item.ID === e.itemData.ID);

    this.tasks.splice(fromIndex, 1);
    this.tasks.splice(toIndex, 0, e.itemData);
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
