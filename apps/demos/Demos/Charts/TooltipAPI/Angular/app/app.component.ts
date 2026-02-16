import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule, DxPieChartComponent, DxPieChartTypes } from 'devextreme-angular/ui/pie-chart';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Population } from './app.service';

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
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  @ViewChild(DxPieChartComponent, { static: false }) chart: DxPieChartComponent;

  populationData: Population[];

  selectedRegion = '';

  constructor(service: Service) {
    this.populationData = service.getPopulationData();
  }

  pointClick({ target: point }: DxPieChartTypes.PointClickEvent) {
    point.showTooltip();
    this.selectedRegion = point.data.region;
  }

  valueChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.chart.instance.getAllSeries()[0].getPointsByArg(value)[0].showTooltip();
  }

  customizeTooltip({ argumentText, valueText }: DxPieChartTypes.PointInfo) {
    return {
      text: `${argumentText}<br/>${valueText}`,
    };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
