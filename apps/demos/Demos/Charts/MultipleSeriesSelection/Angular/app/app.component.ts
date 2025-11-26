import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, Statistics } from './app.service';

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
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  statisticsData: Statistics[];

  constructor(service: Service) {
    this.statisticsData = service.getStatisticsData();
  }

  seriesClick({ target: series }: DxChartTypes.SeriesClickEvent) {
    if (series.isSelected()) {
      series.clearSelection();
    } else {
      series.select();
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
