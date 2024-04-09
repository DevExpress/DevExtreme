import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeMapModule, DxSelectBoxModule } from 'devextreme-angular';
import { PopulationByAge, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
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
    let result = '';

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
      const size = Math.round((totalRect[side + 2]
                    - totalRect[side]) * item.value / totalSum);
      let pos;
      const rect = totalRect.slice();

      totalSum -= item.value;
      rect[side + 2] = totalRect[side] = totalRect[side] + size;
      item.rect = rect;
      side = 1 - side;
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeMapModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
