import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import {
  DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule,
} from 'devextreme-angular';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import type { DxDropDownBoxComponent } from 'devextreme-angular/ui/drop-down-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Service } from './app.service';
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
  private readonly url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridCustomEditors';

  readonly statuses = inject(Service).getStatuses();

  readonly dropDownOptions = { width: 500 };

  readonly editorOptions = {
    itemTemplate: 'statusTemplate',
  };

  readonly tasks = createStore({
    key: 'ID',
    loadUrl: `${this.url}/Tasks`,
    updateUrl: `${this.url}/UpdateTask`,
    insertUrl: `${this.url}/InsertTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly employees = createStore({
    key: 'ID',
    loadUrl: `${this.url}/Employees`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  getSelectedRowKeys<T>(value: T): T[] {
    return value !== null && value !== undefined ? [value] : [];
  }

  onSelectionChanged(
    selectedRowKeys: unknown[],
    cellInfo: DxDataGridTypes.ColumnEditCellTemplateData,
    dropDownBoxComponent: DxDropDownBoxComponent['instance'],
  ) {
    cellInfo.setValue(selectedRowKeys[0]);
    if (selectedRowKeys.length > 0) {
      dropDownBoxComponent.close();
    }
  }

  calculateFilterExpression(
    this: DxDataGridTypes.Column,
    filterValue: number | string,
    selectedFilterOperation: string | null,
    target: string,
  ) {
    if (target === 'search' && typeof (filterValue) === 'string') {
      return [this.dataField, 'contains', filterValue];
    }
    return (rowData: { AssignedEmployee?: (number | string)[] }) => (rowData.AssignedEmployee || []).indexOf(filterValue) !== -1;
  }

  cellTemplate(container: HTMLElement, options: DxDataGridTypes.ColumnCellTemplateData) {
    const noBreakSpace = '\u00A0';

    const assignees = (options.value || []).map(
      (assigneeId: number) => options.column?.lookup?.calculateCellValue?.(assigneeId),
    );
    const text = assignees.join(', ');

    container.textContent = text || noBreakSpace;
    container.title = text;
  }
}

bootstrapApplication(AppComponent);
