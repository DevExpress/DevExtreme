import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, Statistics } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
