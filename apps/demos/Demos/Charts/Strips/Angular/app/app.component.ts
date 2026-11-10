import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const customizeText: DxChartTypes.ArgumentAxisLabel['customizeText'] = ({ valueText }) => `${valueText}&#176F`;

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
  private readonly service = inject(Service);

  private readonly averageTemperatureRange = this.service.getRangeOfAverageTemperature();

  readonly highAverageColor = '#ff9b52';

  readonly lowAverageColor = '#6199e6';

  readonly highAverage = this.averageTemperatureRange.highAverage;

  readonly lowAverage = this.averageTemperatureRange.lowAverage;

  readonly temperaturesData = this.service.getTemperaturesData();

  readonly customizePoint: DxChartTypes.Properties['customizePoint'] = ({ value }) => {
    if (value > this.highAverage) {
      return { color: this.highAverageColor };
    } if (value < this.lowAverage) {
      return { color: this.lowAverageColor };
    }
    return null;
  };

  readonly customizeLabel: DxChartTypes.Properties['customizeLabel'] = ({ value }) => {
    if (value > this.highAverage) {
      return getLabelsSettings(this.highAverageColor);
    } if (value < this.lowAverage) {
      return getLabelsSettings(this.lowAverageColor);
    }
    return null;
  };

  readonly customizeText = customizeText;
}

function getLabelsSettings(backgroundColor: string) {
  return {
    visible: true,
    backgroundColor,
    customizeText,
  };
}

bootstrapApplication(AppComponent);
