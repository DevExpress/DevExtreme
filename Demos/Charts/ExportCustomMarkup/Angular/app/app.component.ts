import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';

import { exportFromMarkup } from 'devextreme/viz/export';
import canvg from 'canvg';
import { Service, OilProductionDataItem } from './app.service';

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
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  oilProductionData: OilProductionDataItem[];

  constructor(service: Service) {
    this.oilProductionData = service.getOilProductionData();
  }

  export() {
    exportFromMarkup(this.prepareMarkup(), {
      width: 820,
      height: 420,
      margin: 0,
      format: 'png',
      svgToCanvas(svg, canvas) {
        return new Promise((resolve) => {
          canvg(canvas, new XMLSerializer().serializeToString(svg), {
            ignoreDimensions: true,
            ignoreClear: true,
            renderCallback: resolve,
          });
        });
      },
    });
  }

  prepareMarkup() {
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="820px" height="420px">${
      document.getElementById('custom_markup_container').innerHTML
    }<g transform="translate(305,12)">${
      this.chart.instance.svg()
    }</g>`
            + '</svg>';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
