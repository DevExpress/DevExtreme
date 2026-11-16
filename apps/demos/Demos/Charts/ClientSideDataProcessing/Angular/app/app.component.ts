import {
  Component,
  enableProdMode,
  inject,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly temperature = [2, 4, 6, 8, 9, 10, 11];

  private readonly palette = ['#c3a2cc', '#b7b5e0', '#e48cba'];

  private paletteIndex = 0;

  private readonly http = inject(HttpClient);

  readonly monthWeather = new DataSource({
    store: new CustomStore({
      load: () => lastValueFrom(this.http.get('../../../../data/monthWeather.json'))
        .catch(() => { throw new Error('Data Loading Error'); }),
      loadMode: 'raw',
    }),
    filter: ['t', '>', '2'],
    paginate: false,
  });

  readonly customizePoint = () => {
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
    provideHttpClient(withFetch()),
  ],
});
