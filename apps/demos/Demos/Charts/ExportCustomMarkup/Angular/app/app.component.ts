import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';
import { exportFromMarkup } from 'devextreme/viz/export';
import { Canvg } from 'canvg';
import { Service, OilProductionDataItem } from './app.service';

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
    DxChartModule,
    DxButtonModule,
  ],
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
            canvas.getContext('2d'),
            new XMLSerializer().serializeToString(svg)
          );

          resolve(v.render());
        });
      },
    });
  }

  prepareMarkup() {
    const sourceContainer = document.getElementById('custom_markup_container');
    const sourceElements = sourceContainer.querySelectorAll('*');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('width', '820px');
    svg.setAttribute('height', '420px');

    const clonedContainer = sourceContainer.cloneNode(true) as HTMLElement;
    const clonedElements = clonedContainer.querySelectorAll('*');

    clonedElements.forEach((clonedEl, index) => {
      const sourceEl = sourceElements[index] as HTMLElement;
      if (!sourceEl) return;

      const computed = window.getComputedStyle(sourceEl);
      ['fill', 'font-family', 'font-size', 'font-weight', 'opacity', 'stroke', 'stroke-width'].forEach((prop) => {
        const value = computed.getPropertyValue(prop)?.trim();
        if (value && value !== 'auto' && value !== 'normal' && value !== 'initial') {
          (clonedEl as SVGElement).setAttribute(prop, value);
        }
      });
    });

    svg.innerHTML = clonedContainer.innerHTML;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', 'translate(305,12)');
    group.innerHTML = this.chart.instance.svg();
    svg.appendChild(group);

    return svg;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
