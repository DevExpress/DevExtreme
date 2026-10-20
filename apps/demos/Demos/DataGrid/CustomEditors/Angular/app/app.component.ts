import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule,
} from 'devextreme-angular';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { createStore, CustomStore } from 'devextreme-aspnet-data-nojquery';
import { Service, Status } from './app.service';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxListModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
  ],
})

export class AppComponent {
  employees: CustomStore;

  tasks: CustomStore;

  statuses: Status[];

  dropDownOptions = { width: 500 };

  editorOptions = {
    itemTemplate: 'statusTemplate',
  };

  url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridCustomEditors';

  constructor(service: Service) {
    this.statuses = service.getStatuses();
    this.tasks = createStore({
      key: 'ID',
      loadUrl: `${this.url}/Tasks`,
      updateUrl: `${this.url}/UpdateTask`,
      insertUrl: `${this.url}/InsertTask`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
    this.employees = createStore({
      key: 'ID',
      loadUrl: `${this.url}/Employees`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  commitValue(key: number, cellInfo, dropDownBoxComponent) {
    cellInfo.setValue(key);
    dropDownBoxComponent.close();
  }

  onRowClick(e: DxDataGridTypes.RowClickEvent, cellInfo, dropDownBoxComponent) {
    const key = e.key;
    if (e.rowType === 'data' && key !== undefined) {
      this.commitValue(key, cellInfo, dropDownBoxComponent);
    }
  }

  onKeyDown(e: DxDataGridTypes.KeyDownEvent, cellInfo, dropDownBoxComponent) {
    if (!e.event || (e.event.key !== 'Enter' && e.event.key !== ' ')) {
      return;
    }

    const focusedRowKey = e.component.option('focusedRowKey');
    const focusedRow = e.component.getVisibleRows().find((row) => (
      row.rowType === 'data' && row.key === focusedRowKey
    ));
    if (focusedRow) {
      e.event.preventDefault();
      this.commitValue(focusedRow.key, cellInfo, dropDownBoxComponent);
    }
  }

  calculateFilterExpression(filterValue, selectedFilterOperation, target) {
    if (target === 'search' && typeof (filterValue) === 'string') {
      return [(this as any).dataField, 'contains', filterValue];
    }
    return (rowData) => (rowData.AssignedEmployee || []).indexOf(filterValue) !== -1;
  }

  cellTemplate(container, options) {
    const noBreakSpace = '\u00A0';

    const assignees = (options.value || []).map(
      (assigneeId: number) => options.column?.lookup?.calculateCellValue?.(assigneeId),
    );
    const text = assignees.join(', ');

    container.textContent = text || noBreakSpace;
    container.title = text;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
