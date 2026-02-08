import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';


import { Month, Service } from './app.service';

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
  providers: [Service],
})
export class AppComponent {
  private year: number = 2017;

  months: Month[];

  selectedMonth: number;

  chartDataSource: DataSource;

  private startOfMonthStr = (month) => `${month}/01/${this.year}`;

  private endOfMonthStr = (month) => {
    const nextMonth = (month === 12) ? 1 : month + 1;
    const nextYear = (month === 12) ? this.year + 1 : this.year;

    const lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();

    return `${month}/${lastDay}/${this.year}`;
  };

  constructor(service: Service) {
    this.months = service.getMonths();
    this.selectedMonth = 1;
    this.chartDataSource = new DataSource({
      key: 'Date',
      load: () => {
        const startVisible = this.startOfMonthStr(this.selectedMonth);
        const endVisible = this.endOfMonthStr(this.selectedMonth);
        const url = 'https://js.devexpress.com/Demos/NetCore/api/TemperatureData'
          + `?startVisible=${encodeURIComponent(startVisible)}`
          + `&endVisible=${encodeURIComponent(endVisible)}`
          + `&startBound=${encodeURIComponent(startVisible)}`
          + `&endBound=${encodeURIComponent(endVisible)}`;

        return fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(`Network response fails: ${r.status}`);
            return r.json();
          })
          .then((arr) => arr.map((item) => ({
            ...item,
            Temperature: (item.MinTemp + item.MaxTemp) / 2,
            Date: new Date(item.Date),
          })));
      },
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

  customizeArgumentAxisText(arg) {
    return new Date(arg.value).getDate();
  }

  onValueChanged(data) {
    this.selectedMonth = data.value;
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
