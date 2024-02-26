import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule } from 'devextreme-angular';

import { StockPrice, Service } from './app.service';

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
  stockPrices: StockPrice[];

  constructor(service: Service) {
    this.stockPrices = service.getStockPrices();
  }

  customizeTooltip(arg) {
    return {
      text: `Open: $${arg.openValue}<br/>`
                + `Close: $${arg.closeValue}<br/>`
                + `High: $${arg.highValue}<br/>`
                + `Low: $${arg.lowValue}<br/>`,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
