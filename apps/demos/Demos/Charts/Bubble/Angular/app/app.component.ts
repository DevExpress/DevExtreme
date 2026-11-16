import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

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
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly title = 'Correlation between Total Population and\n Population with Age over 60';

  readonly dataSource = this.service.getPopulationData();

  readonly correlationSource = this.service.getCorrelationSource();

  readonly customizeTooltip = ({
    point, argumentText, valueText, size,
  }: { point: Record<string, unknown>, argumentText: string, valueText: string, size: number }) => ({
    text: `${point.tag}<br/>Total Population: ${argumentText}M<br/>Population with Age over 60: ${valueText}M (${size}%)`,
  });

  readonly argumentCustomizeText: DxChartTypes.ArgumentAxisLabel['customizeText'] = ({ value }) => `${value}M`;

  readonly valueCustomizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${value}M`;

  onSeriesClick({ target: series }: DxChartTypes.SeriesClickEvent) {
    series.isVisible()
      ? series.hide()
      : series.show();
  }
}

bootstrapApplication(AppComponent);
