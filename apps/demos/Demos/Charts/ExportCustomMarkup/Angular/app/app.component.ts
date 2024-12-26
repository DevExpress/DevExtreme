import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';

import { exportFromMarkup } from 'devextreme/viz/export';
import { Canvg } from 'canvg';
import { Service, OilProductionDataItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
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
          const v = Canvg.fromString(
              canvas.getContext("2d"),
              new XMLSerializer().serializeToString(svg)
          );

          resolve(v.render());
        });
      },
    });
  }

  prepareMarkup() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('width', '820px');
    svg.setAttribute('height', '420px');
    svg.innerHTML = document.getElementById('custom_markup_container').innerHTML;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', 'translate(305,12)');
    group.innerHTML = this.chart.instance.svg();
    svg.appendChild(group);

    return svg;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
