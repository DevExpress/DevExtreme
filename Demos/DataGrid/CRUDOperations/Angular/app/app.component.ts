import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource: CustomStore;

  requests: string[] = [];

  refreshModes = ['full', 'reshape', 'repaint'];

  refreshMode = 'reshape';

  customersData = {
    paginate: true,
    store: new CustomStore({
      key: 'Value',
      loadMode: 'raw',
      load: () => this.sendRequest(`${URL}/CustomersLookup`),
    }),
  };

  shippersData = new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => this.sendRequest(`${URL}/ShippersLookup`),
  });

  constructor(private http: HttpClient) {
    this.dataSource = new CustomStore({
      key: 'OrderID',
      load: () => this.sendRequest(`${URL}/Orders`),
      insert: (values) => this.sendRequest(`${URL}/InsertOrder`, 'POST', {
        values: JSON.stringify(values),
      }),
      update: (key, values) => this.sendRequest(`${URL}/UpdateOrder`, 'PUT', {
        key,
        values: JSON.stringify(values),
      }),
      remove: (key) => this.sendRequest(`${URL}/DeleteOrder`, 'DELETE', {
        key,
      }),
    });
  }

  async sendRequest(url: string, method = 'GET', data = {}) {
    this.logRequest(method, url, data);

    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { withCredentials: true, body: httpParams };
    let request: Observable<Object>;

    switch (method) {
      case 'GET':
        request = this.http.get(url, httpOptions);
        break;
      case 'PUT':
        request = this.http.put(url, httpParams, httpOptions);
        break;
      case 'POST':
        request = this.http.post(url, httpParams, httpOptions);
        break;
      case 'DELETE':
        request = this.http.delete(url, httpOptions);
        break;
    }

    try {
      const result = await lastValueFrom<any>(request);

      return method === 'GET' ? result.data : {};
    } catch (e) {
      throw e.error.Message;
    }
  }

  logRequest(method: string, url: string, data: object): void {
    const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

    const time = formatDate(new Date(), 'HH:mm:ss');

    this.requests.unshift([time, method, url.slice(URL.length), args].join(' '));
  }

  clearRequests() {
    this.requests = [];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxButtonModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
