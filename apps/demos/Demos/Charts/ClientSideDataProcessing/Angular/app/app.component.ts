import {
  Component, AfterViewInit, enableProdMode, provideZoneChangeDetection, inject,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent implements AfterViewInit {
  temperature: number[] = [2, 4, 6, 8, 9, 10, 11];

  palette: string[] = ['#c3a2cc', '#b7b5e0', '#e48cba'];

  paletteIndex = 0;

  monthWeather = {} as DataSource;

  http = inject(HttpClient);

  ngAfterViewInit() {
    this.monthWeather = new DataSource({
      store: new CustomStore({
        load: () => lastValueFrom(this.http.get('../../../../data/monthWeather.json'))
          .catch(() => { throw new Error('Data Loading Error'); }),
        loadMode: 'raw',
      }),
      filter: ['t', '>', '2'],
      paginate: false,
    });
  }

  customizePoint = () => {
    const color = this.palette[this.paletteIndex];
    this.paletteIndex = this.paletteIndex === 2 ? 0 : this.paletteIndex + 1;

    return {
      color,
    };
  };

  customizeText(arg) {
    return `${arg.valueText}&#176C`;
  }

  onValueChanged(data) {
    this.monthWeather.filter(['t', '>', data.value]);
    this.monthWeather.load();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
