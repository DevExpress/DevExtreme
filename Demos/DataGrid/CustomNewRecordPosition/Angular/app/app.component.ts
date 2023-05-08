import {
  NgModule, Component, enableProdMode, ChangeDetectorRef,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import Guid from 'devextreme/core/guid';
import { Service } from './app.service';

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
  dataSource: any;

  newRowPosition = 'viewportTop';

  scrollingMode = 'standard';

  changes = [];

  editRowKey = null;

  newRowPositionOptions = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];

  scrollingModeOptions = ['standard', 'virtual'];

  constructor(service: Service) {
    this.dataSource = service.getDataSource();
    this.onAddButtonClick = this.onAddButtonClick.bind(this);
  }

  onAddButtonClick(e) {
    const key = new Guid().toString();
    this.changes = [{
      key,
      type: 'insert',
      insertAfterKey: e.row.key,
    }];
    this.editRowKey = key;
  }

  isAddButtonVisible({ row }) {
    return !row.isEditing;
  }

  onRowInserted(e) {
    e.component.navigateToRow(e.key);
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
