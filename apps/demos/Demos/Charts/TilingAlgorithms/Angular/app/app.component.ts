import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxTreeMapModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxTreeMapModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly getPopulationsByAge = inject(Service).getPopulationsByAge();

  readonly algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];

  readonly algorithm = signal(this.algorithms[2]);

  readonly layoutAlgorithm = computed(() => (
    this.algorithm() === 'custom' ? this.customAlgorithm : this.algorithm()
  ));

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

bootstrapApplication(AppComponent);
