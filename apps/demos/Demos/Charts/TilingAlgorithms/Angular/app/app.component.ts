import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { DxTreeMapModule, DxSelectBoxModule } from 'devextreme-angular';
import { PopulationByAge, Service } from './app.service';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    BrowserModule,
    DxTreeMapModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  getPopulationsByAge: PopulationByAge[];

  algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];

  constructor(service: Service) {
    this.getPopulationsByAge = service.getPopulationsByAge();
  }

  customizeTooltip(arg) {
    const data = arg.node.data;
    const parentData = arg.node.getParent().data;
    let result: string;

    if (arg.node.isLeaf()) {
      result = `<span class='country'>${parentData.name}</span><br />${
        data.name}<br />${arg.valueText} (${
        (100 * data.value / parentData.total).toFixed(1)}%)`;
    } else {
      result = `<span class='country'>${data.name}</span>`;
    }

    return {
      text: result,
    };
  }

  customAlgorithm(arg) {
    let side = 0;
    const totalRect = arg.rect.slice();
    let totalSum = arg.sum;

    arg.items.forEach((item) => {
      const size = Math.round((totalRect[side + 2] - totalRect[side]) * item.value / totalSum);
      const rect = totalRect.slice();

      totalSum -= item.value;
      const adjustedSize = totalRect[side] + size;
      totalRect[side] = adjustedSize;
      rect[side + 2] = adjustedSize;
      item.rect = rect;
      side = 1 - side;
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
