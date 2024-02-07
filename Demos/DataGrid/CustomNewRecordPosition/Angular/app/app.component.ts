import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Guid from 'devextreme/core/guid';
import CustomStore from 'devextreme/data/custom_store';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0]: never;

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
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
