import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { VisualRange } from 'devextreme-angular/common/charts';
import { DxChartModule, DxChartComponent } from 'devextreme-angular/ui/chart';
import { Service, StockPrice } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  stockPrices: StockPrice[];

  visualRange: VisualRange = {};

  constructor(service: Service) {
    this.stockPrices = service.getStockPrices();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
    DxRangeSelectorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
