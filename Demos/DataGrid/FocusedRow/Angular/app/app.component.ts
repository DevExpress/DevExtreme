import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import {
  BrowserModule, BrowserTransferStateModule, DomSanitizer, SafeHtml,
} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxDataGridComponent,
  DxNumberBoxComponent,
  DxDataGridModule,
  DxNumberBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';

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
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  @ViewChild(DxNumberBoxComponent, { static: false }) numberBox: DxNumberBoxComponent;

  columns: any;

  dataSource: any;

  isReady: boolean;

  taskSubject: string;

  taskDetailsHtml: SafeHtml;

  taskStatus: string;

  taskProgress: string;

  focusedRowKey = 117;

  autoNavigateToFocusedRow = true;

  constructor(private sanitizer: DomSanitizer) {
    this.dataSource = {
      store: {
        type: 'odata',
        key: 'Task_ID',
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
      },
      expand: 'ResponsibleEmployee',
      select: [
        'Task_ID',
        'Task_Subject',
        'Task_Start_Date',
        'Task_Status',
        'Task_Description',
        'Task_Completion',
        'ResponsibleEmployee/Employee_Full_Name',
      ],
    };
    this.columns = [
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
  }

  onFocusedRowChanging(e) {
    const rowsCount = e.component.getVisibleRows().length;
    const pageCount = e.component.pageCount();
    const pageIndex = e.component.pageIndex();
    const key = e.event && e.event.key;

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

  onFocusedRowChanged(e) {
    const rowData = e.row && e.row.data;

    if (rowData) {
      this.taskSubject = rowData.Task_Subject;
      this.taskDetailsHtml = this.sanitizer.bypassSecurityTrustHtml(rowData.Task_Description);
      this.taskStatus = rowData.Task_Status;
      this.taskProgress = rowData.Task_Completion ? `${rowData.Task_Completion}` + '%' : '';
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
