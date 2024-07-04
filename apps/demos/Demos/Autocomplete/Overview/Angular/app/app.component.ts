import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import ODataStore from 'devextreme/data/odata/store';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

function isNotEmpty(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
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

  states: ODataStore;

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
        return lastValueFrom(httpClient.get('https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup', { params }))
          .then(({ data }: { data: Record<string, unknown>[] }) => ({
            data,
          }))
          .catch((error) => { throw 'Data Loading Error'; });
      },
    });
    this.states = new ODataStore({
      version: 2,
      url: 'https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short',
      key: 'Sate_ID',
      keyType: 'Int32',
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
    DxTemplateModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
