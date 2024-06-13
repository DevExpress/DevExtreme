import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxSparklineModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  source: DataSource;

  filters = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  years: Array<number>;

  constructor(http: HttpClient) {
    this.source = new DataSource({
      store: new CustomStore({
        load: () => lastValueFrom(http.get('../../../../data/resourceData.json'))
          .catch((error) => { throw 'Data Loading Error'; }),
        loadMode: 'raw',
      }),
      filter: ['month', '<=', '12'],
      paginate: false,
    });
    this.years = [2010, 2011, 2012];
  }

  onValueChanged(e) {
    const count = e.value;
    this.source.filter(['month', '<=', count]);
    this.source.load();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxSparklineModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
