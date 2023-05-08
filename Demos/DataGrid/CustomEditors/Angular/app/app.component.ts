import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule,
} from 'devextreme-angular';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Service, Status } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  employees: object;

  tasks: object;

  statuses: Status[];

  dropDownOptions: object;

  editorOptions: object;

  url: string;

  constructor(service: Service) {
    this.dropDownOptions = { width: 500 };
    this.editorOptions = {
      itemTemplate: 'statusTemplate',
    };
    this.url = 'https://js.devexpress.com/Demos/Mvc/api/CustomEditors';
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
    return function (data) {
      return (data.AssignedEmployee || []).indexOf(filterValue) !== -1;
    };
  }

  cellTemplate(container, options) {
    const noBreakSpace = '\u00A0';
    const text = (options.value || []).map((element) => options.column.lookup.calculateCellValue(element)).join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxListModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
