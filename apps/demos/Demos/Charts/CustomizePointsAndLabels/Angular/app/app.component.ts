import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

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
  readonly highAverage = 77;

  readonly lowAverage = 58;

  readonly temperaturesData = inject(Service).getTemperaturesData();

  readonly customizePoint: DxChartTypes.Properties['customizePoint'] = ({ value }) => {
    if (value > this.highAverage) {
      return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
    }

    return (value < this.lowAverage)
      ? { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } }
      : null;
  };

  readonly customizeLabel: DxChartTypes.Properties['customizeLabel'] = ({ value }) => {
    if (value > this.highAverage) {
      return {
        visible: true,
        backgroundColor: '#ff7c7c',
        customizeText: this.customizeText,
      };
    }
    return null;
  };

  readonly customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => `${valueText}&#176F`;
}

bootstrapApplication(AppComponent);
