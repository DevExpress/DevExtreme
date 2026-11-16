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
  readonly populationData = inject(Service).getPopulationData();

  readonly customizeTooltip = ({ valueText }: DxChartTypes.CommonPointInfo) => ({
    text: Math.abs(Number(valueText)),
  });

  readonly customizeLabel: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${Math.abs(value as number)}%`;
}

bootstrapApplication(AppComponent);
