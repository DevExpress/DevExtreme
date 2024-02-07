import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxNumberBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';

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
  taskSubject: string;

  taskAssigned: string;

  startDate: string;

  taskStatus: string;

  taskProgress: string;

  focusedRowKey = 45;

  dataSource = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${url}/Tasks`,
    onBeforeSend(_, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  taskEmployees = AspNetData.createStore({
    key: 'ID',
    loadMode: 'raw',
    loadUrl: `${url}/TaskEmployees`,
  });

  onFocusedRowChanged(e: DxTreeListTypes.FocusedRowChangedEvent) {
    const rowData = e.row && e.row.data;
    let cellValue: unknown;
    let assigned: string;

    if (rowData) {
      cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
      this.taskEmployees.byKey(cellValue).done(({ Name }) => {
        assigned = Name;
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
