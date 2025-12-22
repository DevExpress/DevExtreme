import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import Guid from 'devextreme/core/guid';
import { CustomStore } from 'devextreme-angular/common/data';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0] : never;

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
    BrowserModule,
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  dataSource: CustomStore;

  newRowPosition: DxDataGridTypes.NewRowPosition = 'viewportTop';

  scrollingMode: DxDataGridTypes.DataGridScrollMode = 'standard';

  changes = [];

  editRowKey = null;

  newRowPositionOptions: DxDataGridTypes.NewRowPosition[] = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];

  scrollingModeOptions: DxDataGridTypes.DataGridScrollMode[] = ['standard', 'virtual'];

  constructor(service: Service) {
    this.dataSource = service.getDataSource();
  }

  onAddButtonClick = ({ row }: DxDataGridTypes.ColumnButtonClickEvent) => {
    const key = new Guid().toString();
    this.changes = [{
      key,
      type: 'insert',
      insertAfterKey: row.key,
    }];
    this.editRowKey = key;
  };

  isAddButtonVisible({ row }: FirstArgument<DxDataGridTypes.ColumnButton['visible']>) {
    return !row.isEditing;
  }

  async onRowInserted(e: DxDataGridTypes.RowInsertedEvent) {
    await e.component.navigateToRow(e.key);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
