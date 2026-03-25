import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { DxNumberBoxComponent, DxNumberBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';

import { DxDataGridComponent, DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { type Task, Service } from './app.service';

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
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxNumberBoxComponent, { static: false }) numberBox: DxNumberBoxComponent;

  taskSubject: string;

  taskDetails: string;

  taskStatus: string;

  taskProgress: string;

  focusedRowKey = 117;

  autoNavigateToFocusedRow = true;

  dataSource: DataSource;

  columns: DxDataGridTypes.Column[] = [
    {
      dataField: 'Task_ID',
      width: 80,
    }, {
      caption: 'Start Date',
      dataField: 'Task_Start_Date',
      dataType: 'date',
    }, {
      caption: 'Assigned To',
      dataField: 'ResponsibleEmployee.Employee_Full_Name',
      cssClass: 'employee',
      allowSorting: false,
    }, {
      caption: 'Subject',
      dataField: 'Task_Subject',
      width: 350,
    }, {
      caption: 'Status',
      dataField: 'Task_Status',
    },
  ];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: new ArrayStore({
        data: service.getTasks(),
        key: 'Task_ID',
      }),
    });
  }

  onFocusedRowChanging(e: DxDataGridTypes.FocusedRowChangingEvent) {
    const rowsCount = e.component.getVisibleRows().length;
    const pageCount = e.component.pageCount();
    const pageIndex = e.component.pageIndex();
    const key = e.event?.key;

    if (key && e.prevRowIndex === e.newRowIndex) {
      if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
        e.component.pageIndex(pageIndex + 1).done(() => {
          e.component.option('focusedRowIndex', 0);
        });
      } else if (e.newRowIndex === 0 && pageIndex > 0) {
        e.component.pageIndex(pageIndex - 1).done(() => {
          e.component.option('focusedRowIndex', rowsCount - 1);
        });
      }
    }
  }

  onFocusedRowChanged(e: DxDataGridTypes.FocusedRowChangedEvent<Task, number>) {
    const data = e.row?.data;
    this.taskSubject = data?.Task_Subject ?? '';
    this.taskDetails = data?.Task_Description ?? '';
    this.taskStatus = data?.Task_Status ?? '';
    this.taskProgress = data?.Task_Completion ? `${data?.Task_Completion}%` : '';
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
