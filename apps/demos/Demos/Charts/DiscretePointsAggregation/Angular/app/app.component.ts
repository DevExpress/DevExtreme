import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import type { ChartSeriesAggregationMethod, CommonPointInfo } from 'devextreme/viz/chart';
import { MAX_SUFFIX, Service, OilProductionItem } from './app.service';

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
    { displayName: 'Sum', func: 'sum' },
    { displayName: 'Minimum', func: 'min' },
  ];

  useAggregation = true;

  currentFunction: ChartSeriesAggregationMethod = 'avg';

  customizeSeries(seriesName: string) {
    const isMaxSeries = seriesName.endsWith(MAX_SUFFIX);
    const year = isMaxSeries ? seriesName.slice(0, -MAX_SUFFIX.length) : seriesName;

    return {
      barOverlapGroup: year,
      ...(isMaxSeries && {
        aggregation: { enabled: true, method: 'max' as ChartSeriesAggregationMethod },
        color: '#d3d3d3',
        showInLegend: false,
      }),
    };
  }

  customizeTooltip({
    argumentText, seriesName, valueText, point,
  }: CommonPointInfo) {
    const month: string | undefined = point?.data?.month;

    return {
      text: `<b>${argumentText}</b><br/>${seriesName}${month ? ` (${month})` : ''}: ${valueText}`,
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
