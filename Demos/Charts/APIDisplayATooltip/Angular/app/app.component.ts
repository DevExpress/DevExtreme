import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule, DxSelectBoxModule, DxPieChartComponent } from 'devextreme-angular';

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

  pointClick(e: any) {
    const point = e.target;
    point.showTooltip();
    this.selectedRegion = point.argument;
  }

  valueChanged(e: any) {
    this.chart.instance.getAllSeries()[0].getPointsByArg(e.value)[0].showTooltip();
  }

  customizeTooltip(arg: any) {
    return {
      text: `${arg.argumentText}<br/>${arg.valueText}`,
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
