import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpParams, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxAutocompleteModule } from 'devextreme-angular';
import { CustomStore } from 'devextreme-angular/common/data';
import { Service } from './app.service';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

function isNotEmpty(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})

export class AppComponent {
  names: string[];

  surnames: string[];

  positions: string[];

  states: CustomStore;

  clientsStore: CustomStore;

  firstName = '';

  lastName = '';

  position: string;

  state = '';

  currentClient = '';

  fullInfo = '';

  constructor(httpClient: HttpClient, service: Service) {
    this.clientsStore = new CustomStore({
      key: 'Value',
      useDefaultSearch: true,
      async load(loadOptions) {
        let params: HttpParams = new HttpParams();
        [
          'skip',
          'take',
          'filter',
        ].forEach((option) => {
          if (option in loadOptions && isNotEmpty(loadOptions[option])) {
            params = params.set(option, JSON.stringify(loadOptions[option]));
          }
        });
        return lastValueFrom(httpClient.get('https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/CustomersLookup', { params }))
          .then(({ data }: { data: Record<string, unknown>[] }) => ({
            data,
          }))
          .catch(() => { throw 'Data Loading Error'; });
      },
    });
    this.states = AspNetData.createStore({
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridStatesLookup',
      key: 'ID',
    });
    this.names = service.getNames();
    this.surnames = service.getSurnames();
    this.positions = service.getPositions();
    this.position = this.positions[0];
  }

  updateEmployeeInfo() {
    let result = '';
    result += (`${this.firstName || ''} ${this.lastName || ''}`).trim();
    result += (result && this.position) ? (`, ${this.position}`) : this.position || '';
    result += (result && this.state) ? (`, ${this.state}`) : this.state || '';
    result += (result && this.currentClient) ? (`, ${this.currentClient}`) : this.currentClient || '';
    this.fullInfo = result;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxAutocompleteModule,
  ],
  providers: [provideHttpClient(withFetch())],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
