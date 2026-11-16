import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
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
  readonly populationData = inject(Service).getPopulationData();

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

bootstrapApplication(AppComponent);
