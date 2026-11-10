import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { HttpClient, HttpParams, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxAutocompleteModule } from 'devextreme-angular';
import { CustomStore } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

function isNotEmpty(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function createClientsStore(httpClient: HttpClient) {
  return new CustomStore({
    key: 'Value',
    useDefaultSearch: true,
    load(loadOptions) {
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
        .catch(() => { throw new Error('Data Loading Error'); });
    },
  });
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxAutocompleteModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly names = this.service.getNames();

  readonly surnames = this.service.getSurnames();

  readonly positions = this.service.getPositions();

  readonly states = AspNetData.createStore({
    loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridStatesLookup',
    key: 'ID',
  });

  readonly clientsStore = createClientsStore(inject(HttpClient));

  firstName = '';

  lastName = '';

  readonly position = this.positions[0];

  state = '';

  currentClient = '';

  readonly fullInfo = signal('');

  updateEmployeeInfo() {
    let result = '';
    result += (`${this.firstName || ''} ${this.lastName || ''}`).trim();
    result += (result && this.position) ? (`, ${this.position}`) : this.position || '';
    result += (result && this.state) ? (`, ${this.state}`) : this.state || '';
    result += (result && this.currentClient) ? (`, ${this.currentClient}`) : this.currentClient || '';
    this.fullInfo.set(result);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
