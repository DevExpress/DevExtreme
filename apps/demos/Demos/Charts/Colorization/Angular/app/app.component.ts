import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeMapModule, DxTreeMapTypes } from 'devextreme-angular/ui/tree-map';
import { Service } from './app.service';

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
  readonly salesAmount = inject(Service).getSalesAmount();

  readonly colorizationOptions: ColorizationOption[] = [{
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

  readonly options = signal(this.colorizationOptions[2].options);

  readonly customizeTooltip = ({ node, valueText }) => (
    {
      text: node.isLeaf()
        ? (`<span class='product'>${node.data.name}</span><br/>Sales Amount: ${valueText}`)
        : null,
    }
  );
}

bootstrapApplication(AppComponent);
