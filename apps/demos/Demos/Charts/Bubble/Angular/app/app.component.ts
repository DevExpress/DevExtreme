import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Population, CorrelationDescription, Service } from './app.service';

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
    DxChartModule,
  ],
})
export class AppComponent {
  title = 'Correlation between Total Population and\n Population with Age over 60';

  dataSource: Population[];

  correlationSource: CorrelationDescription[];

  constructor(service: Service) {
    this.dataSource = service.getPopulationData();
    this.correlationSource = service.getCorrelationSource();
  }

  customizeTooltip = ({
    point, argumentText, valueText, size,
  }: { point: Record<string, unknown>, argumentText: string, valueText: string, size: number }) => ({
    text: `${point.tag}<br/>Total Population: ${argumentText}M<br/>Population with Age over 60: ${valueText}M (${size}%)`,
  });

  argumentCustomizeText: DxChartTypes.ArgumentAxisLabel['customizeText'] = ({ value }) => `${value}M`;

  valueCustomizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${value}M`;

  onSeriesClick({ target: series }: DxChartTypes.SeriesClickEvent) {
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
