import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { SingleMultipleAllOrNone } from 'devextreme-angular/common';
import { DxListModule, DxListTypes } from 'devextreme-angular/ui/list';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  tasks: DataSource;

  selectAllModeValue: DxListTypes.SelectAllMode = 'page';

  selectionModeValue: SingleMultipleAllOrNone = 'all';

  selectByClick = false;

  constructor(service: Service) {
    this.tasks = new DataSource({
      store: new ArrayStore({
        key: 'id',
        data: service.getTasks(),
      }),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSelectBoxModule,
    DxListModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
