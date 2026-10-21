import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import type { ChartSeriesAggregationMethod } from 'devextreme/viz/chart';
import { Service, OilProductionItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  dataSource: OilProductionItem[];

  functions: { displayName: string; func: ChartSeriesAggregationMethod }[] = [
    { displayName: 'Average', func: 'avg' },
    { displayName: 'Maximum', func: 'max' },
    { displayName: 'Minimum', func: 'min' },
  ];

  useAggregation = true;

  currentFunction: ChartSeriesAggregationMethod = 'avg';

  customizeSeries(seriesName: string) {
    const isGhost = seriesName.endsWith(' (max)');
    const year = isGhost ? seriesName.slice(0, -6) : seriesName;

    return {
      barOverlapGroup: year,
      ...(isGhost && {
        aggregation: { enabled: true, method: 'max' as ChartSeriesAggregationMethod },
        color: '#d3d3d3',
        name: `${year} max`,
        showInLegend: false,
      }),
    };
  }

  constructor(service: Service) {
    this.dataSource = service.getOilProductionData();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
