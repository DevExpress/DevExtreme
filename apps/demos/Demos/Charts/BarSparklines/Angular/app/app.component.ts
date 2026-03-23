import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxSparklineModule, DxSelectBoxModule } from 'devextreme-angular';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';

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
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxSparklineModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  source: DataSource;

  filters = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  years: number[];

  constructor(http: HttpClient) {
    this.source = new DataSource({
      store: new CustomStore({
        load: () => lastValueFrom(http.get('../../../../data/resourceData.json'))
          .catch(() => { throw new Error('Data Loading Error'); }),
        loadMode: 'raw',
      }),
      filter: ['month', '<=', '12'],
      paginate: false,
    });
    this.years = [2021, 2022, 2023];
  }

  onValueChanged(e) {
    const count = e.value;
    this.source.filter(['month', '<=', count]);
    this.source.load();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
