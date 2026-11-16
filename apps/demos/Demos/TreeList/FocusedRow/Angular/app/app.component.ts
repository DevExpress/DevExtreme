import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxNumberBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxTreeListModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  readonly taskSubject = signal('');

  readonly taskAssigned = signal('');

  readonly startDate = signal('');

  readonly taskStatus = signal('');

  readonly taskProgress = signal('');

  readonly focusedRowKey = signal(45);

  readonly dataSource = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${url}/Tasks`,
    onBeforeSend(_, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly taskEmployees = AspNetData.createStore({
    key: 'ID',
    loadMode: 'raw',
    loadUrl: `${url}/TaskEmployees`,
  });

  onFocusedRowChanged(e: DxTreeListTypes.FocusedRowChangedEvent) {
    const rowData = e.row?.data;
    let cellValue: unknown;
    let assigned: string;

    if (rowData) {
      cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
      this.taskEmployees.byKey(cellValue).done(({ Name }) => {
        assigned = Name;
      });

      this.taskSubject.set(rowData.Task_Subject);
      this.taskAssigned.set(assigned);
      this.startDate.set(new Date(rowData.Task_Start_Date).toLocaleDateString());

      this.taskStatus.set(rowData.Task_Status);
      this.taskProgress.set(rowData.Task_Completion ? `${rowData.Task_Completion}%` : '');
    }
  }
}

bootstrapApplication(AppComponent);
