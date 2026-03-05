import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { CustomStore } from 'devextreme-angular/common/data';
import { lastValueFrom } from 'rxjs';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  dataSource: CustomStore;

  pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;

  baseUrl = 'https://js.devexpress.com/Demos/NetCore';

  constructor(private httpClient: HttpClient) {
    const url = `${this.baseUrl}/api/DataGridEmployeesValidation`;

    this.dataSource = AspNetData.createStore({
      key: 'ID',
      loadUrl: url,
      insertUrl: url,
      updateUrl: url,
      deleteUrl: url,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  asyncValidation = async (params: Record<string, unknown> & { data: Record<string, unknown> }) => {
    const emailValidationUrl = `${this.baseUrl}/RemoteValidation/CheckUniqueEmailAddress`;

    const result = await lastValueFrom(this.httpClient.get(emailValidationUrl, {
      params: {
        id: params.data.ID,
        email: params.value,
      },
      responseType: 'json',
    }));

    return result;
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
