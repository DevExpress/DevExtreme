import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxDataGridComponent, DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { antiForgeryInterceptor } from './anti-forgery.interceptor';
import { AntiForgeryTokenService } from './anti-forgery-token.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const BASE_PATH = 'http://localhost:5555';
// const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore';
const URL = `${BASE_PATH}/api/DataGridBatchUpdateWebApi`;

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

  constructor(private http: HttpClient, private tokenService: AntiForgeryTokenService) {
    this.ordersStore = AspNetData.createStore({
      key: 'OrderID',
      loadUrl: `${URL}/Orders`,
      async onBeforeSend(_method, ajaxOptions) {
        const tokenData = await lastValueFrom(tokenService.getToken());
        ajaxOptions.xhrFields = {
          withCredentials: true,
          headers: { [tokenData.headerName]: tokenData.token },
        };
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
    try {
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
    } catch (error: any) {
      const errorMessage = (typeof error?.error === 'string' && error.error)
        ? error.error
        : (error?.statusText || 'Unknown error');
      throw new Error(`Batch save failed: ${errorMessage}`);
    }
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
    provideHttpClient(
      withFetch(),
      withInterceptors([antiForgeryInterceptor]),
    ),
  ],
});
