import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import DxDataGrid from 'devextreme/ui/data_grid';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { lastValueFrom } from 'rxjs';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridBatchUpdateWebApi';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  ordersStore: any;

  constructor(private http: HttpClient) {
    this.ordersStore = AspNetData.createStore({
      key: 'OrderID',
      loadUrl: `${URL}/Orders`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  onSaving(e: any) {
    e.cancel = true;

    if (e.changes.length) {
      e.promise = this.processBatchRequest(`${URL}/Batch`, e.changes, e.component);
    }
  }

  async processBatchRequest(url: string, changes: Array<{}>, component: DxDataGrid): Promise<any> {
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
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
