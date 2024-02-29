import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import {
  BrowserModule, BrowserTransferStateModule, DomSanitizer, SafeHtml,
} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxNumberBoxComponent, DxNumberBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';
import { DxDataGridComponent, DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

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

  isReady: boolean;

  taskSubject: string;

  taskDetailsHtml: SafeHtml;

  taskStatus: string;

  taskProgress: string;

  focusedRowKey = 117;

  autoNavigateToFocusedRow = true;

  dataSource: DataSourceOptions = {
    store: {
      type: 'odata',
      version: 2,
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

  constructor(private sanitizer: DomSanitizer) {}

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

  onFocusedRowChanged({ row: { data } }: DxDataGridTypes.FocusedRowChangedEvent) {
    this.taskSubject = data.Task_Subject;
    this.taskDetailsHtml = this.sanitizer.bypassSecurityTrustHtml(data.Task_Description);
    this.taskStatus = data.Task_Status;
    this.taskProgress = data.Task_Completion ? `${data.Task_Completion}` + '%' : '';
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
