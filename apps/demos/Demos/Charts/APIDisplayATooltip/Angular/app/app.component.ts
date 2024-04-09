import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule, DxPieChartComponent, DxPieChartTypes } from 'devextreme-angular/ui/pie-chart';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Population } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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

  customizeTooltip({ argumentText, valueText }: Record<string, string>) {
    return {
      text: `${argumentText}<br/>${valueText}`,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPieChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
