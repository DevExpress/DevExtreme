import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule,
} from 'devextreme-angular';
import { createStore, CustomStore } from 'devextreme-aspnet-data-nojquery';
import { Service, Status } from './app.service';
import 'anti-forgery';

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

  getSelectedRowKeys<T>(value: T): T[] {
    return value !== null && value !== undefined ? [value] : [];
  }

  onSelectionChanged(selectedRowKeys, cellInfo, dropDownBoxComponent) {
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
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
