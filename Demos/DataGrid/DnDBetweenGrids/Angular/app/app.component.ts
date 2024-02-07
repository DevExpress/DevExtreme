import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Priority, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
  providers: [Service],
})
export class AppComponent {
  dataSource: DataSourceOptions;

  priorities: Array<Priority>;

  tasksStore: AspNetData.CustomStore;

  url = 'https://js.devexpress.com/Demos/Mvc/api/DnDBetweenGrids';

  statuses = [1, 2];

  constructor(service: Service) {
    this.priorities = service.getPriorities();
    this.tasksStore = AspNetData.createStore({
      key: 'ID',
      loadUrl: `${this.url}/Tasks`,
      updateUrl: `${this.url}/UpdateTask`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.dataSource = {
      store: this.tasksStore,
      reshapeOnPush: true,
    };
  }

  onAdd = (e: Parameters<DxDataGridTypes.RowDragging['onAdd']>[0]) => {
    const key = e.itemData.ID;
    const values = { Status: e.toData };

    this.tasksStore.update(key, values).then(() => {
      this.tasksStore.push([{
        type: 'update', key, data: values,
      }]);
    });
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
