import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
})
export class AppComponent {
  dataSource: CustomStore;

  pattern = /^\(\d{3}\) \d{3}-\d{4}$/i;

  constructor(private httpClient: HttpClient) {
    const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridEmployeesValidation';

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
    const emailValidationUrl = 'https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress';

    const result = await lastValueFrom(this.httpClient.post(emailValidationUrl, {
      id: params.data.ID,
      email: params.value,
    }, {
      responseType: 'json',
    }));

    return result;
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    HttpClientModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
