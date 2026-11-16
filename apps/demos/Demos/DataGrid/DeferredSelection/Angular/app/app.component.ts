import {
  Component,
  AfterViewInit,
  enableProdMode,
  signal,
  viewChild,
} from '@angular/core';
import { DxDataGridModule, DxDataGridComponent, DxButtonModule } from 'devextreme-angular';
import { query } from 'devextreme-angular/common/data';
import { bootstrapApplication } from '@angular/platform-browser';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly tasksDataSource = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${url}/Tasks`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly employeesDataSource = AspNetData.createStore({
    key: 'ID',
    loadUrl: `${url}/TaskEmployees`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly statistics = signal({ taskCount: 0, peopleCount: 0, avgDuration: 0 });

  ngAfterViewInit() {
    this.calculateStatistics();
  }

  async calculateStatistics() {
    const selectedItems = await this.dataGrid().instance.getSelectedRowsData();

    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const dueDateTime = new Date(item.Task_Due_Date).getTime();
      const startDateTime = new Date(item.Task_Start_Date).getTime();
      const duration = dueDateTime - startDateTime;

      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;

    this.statistics.set({
      taskCount: selectedItems.length,
      peopleCount: query(selectedItems)
        .groupBy('Task_Assigned_Employee_ID')
        .toArray().length,
      avgDuration: Math.round(averageDurationInDays) || 0,
    });
  }
}

bootstrapApplication(AppComponent);
