import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';
import data from 'devextreme/data/odata/store';
import CustomStore from 'devextreme/data/custom_store';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

function isNotEmpty(value: any): boolean {
  return value !== undefined && value !== null && value !== '';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  names: string[];

  surnames: string[];

  positions: string[];

  states: any;

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
      load(loadOptions: any) {
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
          .then((data: any) => ({
            data: data.data,
          }))
          .catch((error) => { throw 'Data Loading Error'; });
      },
    });
    this.states = new data({
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
    BrowserTransferStateModule,
    DxAutocompleteModule,
    DxTemplateModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
