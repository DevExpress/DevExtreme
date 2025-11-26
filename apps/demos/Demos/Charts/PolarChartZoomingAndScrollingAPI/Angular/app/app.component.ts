import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { DxPolarChartModule, DxPolarChartTypes } from 'devextreme-angular/ui/polar-chart';
import { DataFrame, Service } from './app.service';

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
    DxPolarChartModule,
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  dataSource: DataFrame[];

  visualRange: DxPolarChartTypes.ValueAxis['visualRange'] = {};

  constructor(service: Service) {
    this.visualRange = { startValue: 0, endValue: 8 };
    this.dataSource = service.getDataSource();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
