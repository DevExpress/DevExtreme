import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule, DxNumberBoxModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  columns: any;

  dataSource: any;

  taskEmployees: any;

  taskSubject: string;

  taskAssigned: string;

  startDate: string;

  taskStatus: string;

  taskProgress: string;

  focusedRowKey: number;

  constructor() {
    this.focusedRowKey = 4;
    this.dataSource = AspNetData.createStore({
      key: 'Task_ID',
      loadUrl: `${url}/Tasks`,
      onBeforeSend(_, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
    this.taskEmployees = AspNetData.createStore({
      key: 'ID',
      loadMode: 'raw',
      loadUrl: `${url}/TaskEmployees`,
    });
  }

  onFocusedRowChanged(e) {
    const rowData = e.row && e.row.data;
    let cellValue;
    let assigned;

    if (rowData) {
      cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
      this.taskEmployees.byKey(cellValue).done((item) => {
        assigned = item.Name;
      });

      this.taskSubject = rowData.Task_Subject;
      this.taskAssigned = assigned;
      this.startDate = new Date(rowData.Task_Start_Date).toLocaleDateString();

      this.taskStatus = rowData.Task_Status;
      this.taskProgress = rowData.Task_Completion ? `${rowData.Task_Completion}%` : '';
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeListModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
