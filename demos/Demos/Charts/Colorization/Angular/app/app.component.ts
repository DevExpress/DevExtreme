import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeMapModule, DxTreeMapTypes } from 'devextreme-angular/ui/tree-map';
import { SalesAmount, Service } from './app.service';

interface ColorizationOption {
  name: string;
  options: {
    type: DxTreeMapTypes.TreeMapColorizerType,
    palette: string | string[],
    colorizeGroups: boolean,
    colorCodeField?: string,
    range?: number[],
  };
}

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
  salesAmount: SalesAmount[];

  options: ColorizationOption[ 'options' ];

  colorizationOptions: ColorizationOption[] = [{
    name: 'Discrete',
    options: {
      type: 'discrete',
      palette: 'harmony light',
      colorizeGroups: false,
    },
  }, {
    name: 'Grouped',
    options: {
      type: 'discrete',
      palette: 'harmony light',
      colorizeGroups: true,
    },
  }, {
    name: 'Range',
    options: {
      type: 'range',
      palette: ['#fbd600', '#78299a'],
      range: [0, 50000, 100000, 150000, 200000, 250000],
      colorCodeField: 'salesAmount',
      colorizeGroups: false,
    },
  }, {
    name: 'Gradient',
    options: {
      type: 'gradient',
      palette: ['#fbd600', '#78299a'],
      range: [10000, 250000],
      colorCodeField: 'salesAmount',
      colorizeGroups: false,
    },
  }];

  constructor(service: Service) {
    this.salesAmount = service.getSalesAmount();
    this.options = this.colorizationOptions[2].options;
  }

  customizeTooltip = ({ node, valueText }) => (
    {
      text: node.isLeaf()
        ? (`<span class='product'>${node.data.name}</span><br/>Sales Amount: ${valueText}`)
        : null,
    }
  );
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
