import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';

import { DxNumberBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';

import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { type Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly focusedTask = signal<Task | undefined>(undefined);

  readonly taskProgress = computed(() => {
    const completion = this.focusedTask()?.Task_Completion;

    return completion ? `${completion}%` : '';
  });

  readonly focusedRowKey = signal(117);

  readonly autoNavigateToFocusedRow = signal(true);

  readonly dataSource = new DataSource({
    store: new ArrayStore({
      data: inject(Service).getTasks(),
      key: 'Task_ID',
    }),
  });

  readonly columns: DxDataGridTypes.Column[] = [
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
    this.focusedTask.set(e.row?.data);
  }
}

bootstrapApplication(AppComponent);
