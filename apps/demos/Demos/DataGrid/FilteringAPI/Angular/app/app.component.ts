import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'devextreme/data/odata/store';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})

export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  statuses = ['All', 'Not Started', 'In Progress', 'Need Assistance', 'Deferred', 'Completed'];

  tasks: DataSourceOptions = {
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
      'Task_Priority',
      'ResponsibleEmployee/Employee_Full_Name',
    ],
  };

  selectStatus({ value }) {
    if (value == 'All') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['Task_Status', '=', value]);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
