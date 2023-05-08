import {
  NgModule, Component, ViewChild, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule, DxDataGridComponent, DxButtonModule } from 'devextreme-angular';
import query from 'devextreme/data/query';
import 'devextreme/data/odata/store';

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

  dataSource: any = {
    store: {
      type: 'odata',
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

  calculateStatistics() {
    this.dataGrid.instance.getSelectedRowsData().then((rowData) => {
      let commonDuration = 0;

      for (let i = 0; i < rowData.length; i++) {
        commonDuration += rowData[i].Task_Due_Date - rowData[i].Task_Start_Date;
      }
      commonDuration /= this.MILLISECONDS_IN_DAY;

      this.taskCount = rowData.length;
      this.peopleCount = query(rowData)
        .groupBy('ResponsibleEmployee.Employee_Full_Name')
        .toArray()
        .length;

      this.avgDuration = Math.round(commonDuration / rowData.length) || 0;
    });
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
