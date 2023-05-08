import {
  NgModule, Component, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import query from 'devextreme/data/query';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent implements AfterViewInit {
  temperature: number[] = [2, 4, 6, 8, 9, 10, 11];

  palette: string[] = ['#c3a2cc', '#b7b5e0', '#e48cba'];

  paletteIndex = 0;

  monthWeather: any = {};

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.monthWeather = new DataSource({
      store: new CustomStore({
        load: () => lastValueFrom(this.http.get('../../../../data/monthWeather.json'))
          .catch((error) => { throw 'Data Loading Error'; }),
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    HttpClientModule,
    DxChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
