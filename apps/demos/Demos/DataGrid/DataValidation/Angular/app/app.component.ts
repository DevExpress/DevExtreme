import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { lastValueFrom } from 'rxjs';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = 'https://js.devexpress.com/Demos/NetCore';

  private readonly url = `${this.baseUrl}/api/DataGridEmployeesValidation`;

  readonly dataSource = AspNetData.createStore({
    key: 'ID',
    loadUrl: this.url,
    insertUrl: this.url,
    updateUrl: this.url,
    deleteUrl: this.url,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  readonly pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;

  readonly asyncValidation = async (params: Record<string, unknown> & { data: Record<string, unknown> }) => {
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
    provideHttpClient(withFetch()),
  ],
});
