import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxDataGridComponent, DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const URL = 'https://js.devexpress.com/Demos/NetCore/api/DataGridBatchUpdateWebApi';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  ordersStore: AspNetData.CustomStore;

  constructor(private http: HttpClient) {
    this.ordersStore = AspNetData.createStore({
      key: 'OrderID',
      loadUrl: `${URL}/Orders`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  onSaving(e: DxDataGridTypes.SavingEvent) {
    e.cancel = true;

    if (e.changes.length) {
      const changes = this.normalizeChanges(e.changes);
      e.promise = this.processBatchRequest(`${URL}/Batch`, changes, e.component);
    }
  }

  async processBatchRequest(
    url: string,
    changes: DxDataGridTypes.DataChange[],
    component: DxDataGridComponent['instance'],
  ): Promise<void> {
    await lastValueFrom(
      this.http.post(url, JSON.stringify(changes), {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
    await component.refresh(true);
    component.cancelEditData();
  }

  normalizeChanges(changes: DxDataGridTypes.DataChange[]): DxDataGridTypes.DataChange[] {
    return changes.map((c) => {
      switch (c.type) {
        case 'insert':
          return {
            type: c.type,
            data: c.data,
          };
        case 'update':
          return {
            type: c.type,
            key: c.key,
            data: c.data,
          };
        case 'remove':
          return {
            type: c.type,
            key: c.key,
          };
        default:
          return c;
      }
    }) as DxDataGridTypes.DataChange[];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
