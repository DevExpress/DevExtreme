import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
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
    DxChartModule,
  ],
})
export class AppComponent {
  populationData: Population[];

  constructor(service: Service) {
    this.populationData = service.getPopulationData();
  }

  customizeTooltip({ valueText, point, seriesName }) {
    const items = valueText.split('\n');
    const color = point.getColor();

    items.forEach((item, index) => {
      if (item.indexOf(seriesName) === 0) {
        const element = document.createElement('span');

        element.textContent = item;
        element.style.color = color;
        element.className = 'active';

        items[index] = element.outerHTML;
      }
    });

    return { text: items.join('\n') };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
