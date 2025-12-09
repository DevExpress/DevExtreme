import {
  Component, ViewChild, AfterViewInit, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { DxDataGridModule, DxDataGridComponent, DxButtonModule } from 'devextreme-angular';
import { query } from 'devextreme-angular/common/data';
import { bootstrapApplication } from '@angular/platform-browser';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

  tasksDataSource: AspNetData.CustomStore;

  employeesDataSource: AspNetData.CustomStore;

  taskCount = 0;

  peopleCount = 0;

  avgDuration = 0;

  constructor() {
    const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

    this.tasksDataSource = AspNetData.createStore({
      key: 'Task_ID',
      loadUrl: `${url}/Tasks`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.employeesDataSource = AspNetData.createStore({
      key: 'ID',
      loadUrl: `${url}/TaskEmployees`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  ngAfterViewInit() {
    this.calculateStatistics();
  }

  async calculateStatistics() {
    const selectedItems = await this.dataGrid.instance.getSelectedRowsData();

    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const dueDateTime = new Date(item.Task_Due_Date).getTime();
      const startDateTime = new Date(item.Task_Start_Date).getTime();
      const duration = dueDateTime - startDateTime;

      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / this.MILLISECONDS_IN_DAY / selectedItems.length;

    this.taskCount = selectedItems.length;
    this.peopleCount = query(selectedItems)
      .groupBy('Task_Assigned_Employee_ID')
      .toArray().length;
    this.avgDuration = Math.round(averageDurationInDays) || 0;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
