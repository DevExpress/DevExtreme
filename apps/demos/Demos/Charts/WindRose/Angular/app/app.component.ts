import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxPolarChartModule, DxPolarChartTypes } from 'devextreme-angular/ui/polar-chart';
import { WindRose, WindDescription, Service } from './app.service';

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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  windRoseData: WindRose[];

  windSources: WindDescription[];

  constructor(service: Service) {
    this.windRoseData = service.getWindRoseData();
    this.windSources = service.getWindSources();
  }

  onLegendClick({ target: series }: DxPolarChartTypes.LegendClickEvent) {
    series.isVisible()
      ? series.hide()
      : series.show();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
