import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';

import { Month, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  months: Month[];

  chartDataSource: DataSource;

  constructor(service: Service) {
    this.months = service.getMonths();
    this.chartDataSource = new DataSource({
      store: {
        type: 'odata',
        version: 2,
        url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/WeatherItems',
      },
      postProcess: (results) => results[0].DayItems,
      expand: 'DayItems',
      filter: ['Id', '=', 1],
      paginate: false,
    });
  }

  customizeTooltip(arg) {
    return {
      text: `${arg.valueText}&#176C`,
    };
  }

  customizeText(arg) {
    return `${arg.valueText}&#176C`;
  }

  onValueChanged(data) {
    this.chartDataSource.filter(['Id', '=', data.value]);
    this.chartDataSource.load();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
