import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSparklineModule } from 'devextreme-angular';
import { CostInfo, Service } from './app.service';

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
  imports: [
    DxSparklineModule,
  ],
})
export class AppComponent {
  oilCosts: CostInfo[];

  goldCosts: CostInfo[];

  silverCosts: CostInfo[];

  years: number[];

  constructor(service: Service) {
    this.oilCosts = service.getOilCosts();
    this.goldCosts = service.getGoldCosts();
    this.silverCosts = service.getSilverCosts();
    this.years = [2021, 2022, 2023];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
