import {
  NgModule, Component, ViewChild, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxDataGridComponent, DxButtonModule } from 'devextreme-angular';
import query from 'devextreme/data/query';
import 'devextreme/data/odata/store';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent implements AfterViewInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

  dataSource: DataSourceOptions = {
    store: {
      type: 'odata',
      version: 2,
      url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
      key: 'Task_ID',
    },
    expand: 'ResponsibleEmployee',
    select: [
      'Task_ID',
      'Task_Subject',
      'Task_Start_Date',
      'Task_Due_Date',
      'Task_Status',
      'ResponsibleEmployee/Employee_Full_Name',
    ],
  };

  taskCount = 0;

  peopleCount = 0;

  avgDuration = 0;

  ngAfterViewInit() {
    this.calculateStatistics();
  }

  async calculateStatistics() {
    const selectedItems = await this.dataGrid.instance.getSelectedRowsData();

    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const duration = item.Task_Due_Date - item.Task_Start_Date;

      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / this.MILLISECONDS_IN_DAY / selectedItems.length;

    this.taskCount = selectedItems.length;
    this.peopleCount = query(selectedItems)
      .groupBy('ResponsibleEmployee.Employee_Full_Name')
      .toArray().length;
    this.avgDuration = Math.round(averageDurationInDays) || 0;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
