import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DataSourceOptions } from 'devextreme-angular/common/data';
import { DxDataGridModule, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly url = 'https://js.devexpress.com/Demos/NetCore/api/DnDBetweenGrids';

  private readonly tasksStore = AspNetData.createStore({
    key: 'ID',
    loadUrl: `${this.url}/Tasks`,
    updateUrl: `${this.url}/UpdateTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly dataSource: DataSourceOptions = {
    store: this.tasksStore,
    reshapeOnPush: true,
  };

  readonly priorities = inject(Service).getPriorities();

  readonly statuses = [1, 2];

  readonly onAdd = (e: DxDataGridTypes.RowDraggingAddEvent) => {
    const key = e.itemData.ID;
    const values = { Status: e.toData };

    this.tasksStore.update(key, values).then(() => {
      this.tasksStore.push([{
        type: 'update', key, data: values,
      }]);
    });
  };
}

bootstrapApplication(AppComponent);
