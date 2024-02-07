import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSparklineModule } from 'devextreme-angular';
import { CostInfo, Service } from './app.service';

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
  oilCosts: CostInfo[];

  goldCosts: CostInfo[];

  silverCosts: CostInfo[];

  years: Array<number>;

  constructor(service: Service) {
    this.oilCosts = service.getOilCosts();
    this.goldCosts = service.getGoldCosts();
    this.silverCosts = service.getSilverCosts();
    this.years = [2010, 2011, 2012];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSparklineModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
