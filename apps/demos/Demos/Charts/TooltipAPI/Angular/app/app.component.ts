import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild, signal,
} from '@angular/core';
import { DxPieChartModule, DxPieChartComponent, DxPieChartTypes } from 'devextreme-angular/ui/pie-chart';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly chart = viewChild.required(DxPieChartComponent);

  readonly populationData = inject(Service).getPopulationData();

  readonly selectedRegion = signal('');

  pointClick({ target: point }: DxPieChartTypes.PointClickEvent) {
    point.showTooltip();
    this.selectedRegion.set(point.data.region);
  }

  valueChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.chart().instance.getAllSeries()[0].getPointsByArg(value)[0].showTooltip();
  }

  customizeTooltip({ argumentText, valueText }: DxPieChartTypes.PointInfo) {
    return {
      text: `${argumentText}<br/>${valueText}`,
    };
  }
}

bootstrapApplication(AppComponent);
