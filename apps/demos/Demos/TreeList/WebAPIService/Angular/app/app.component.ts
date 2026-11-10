import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

  readonly tasksData = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${this.url}/Tasks`,
    insertUrl: `${this.url}/InsertTask`,
    updateUrl: `${this.url}/UpdateTask`,
    deleteUrl: `${this.url}/DeleteTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly employeesData = AspNetData.createStore({
    key: 'ID',
    loadUrl: `${this.url}/TaskEmployees`,
  });

  readonly statusesData = [
    'Not Started',
    'Need Assistance',
    'In Progress',
    'Deferred',
    'Completed',
  ];

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.Task_Status = 'Not Started';
    e.data.Task_Start_Date = new Date();
    e.data.Task_Due_Date = new Date();
  }
}

bootstrapApplication(AppComponent);
