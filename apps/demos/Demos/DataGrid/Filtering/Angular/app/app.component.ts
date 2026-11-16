import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import { DxoHeaderFilterComponent } from 'devextreme-angular/ui/nested/header-filter';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly orders = inject(Service).getOrders();

  readonly showFilterRow = signal(true);

  readonly showHeaderFilter = signal(true);

  readonly applyFilterTypes = [{
    key: 'auto',
    name: 'Immediately',
  }, {
    key: 'onClick',
    name: 'On Button Click',
  }];

  readonly saleAmountHeaderFilter: DxoHeaderFilterComponent['dataSource'] = [{
    text: 'Less than $3000',
    value: ['SaleAmount', '<', 3000],
  }, {
    text: '$3000 - $5000',
    value: [
      ['SaleAmount', '>=', 3000],
      ['SaleAmount', '<', 5000],
    ],
  }, {
    text: '$5000 - $10000',
    value: [
      ['SaleAmount', '>=', 5000],
      ['SaleAmount', '<', 10000],
    ],
  }, {
    text: '$10000 - $20000',
    value: [
      ['SaleAmount', '>=', 10000],
      ['SaleAmount', '<', 20000],
    ],
  }, {
    text: 'Greater than $20000',
    value: ['SaleAmount', '>=', 20000],
  }];

  readonly currentFilter = signal(this.applyFilterTypes[0].key);

  private static getOrderDay({ OrderDate }) {
    return (new Date(OrderDate)).getDay();
  }

  calculateFilterExpression(value: string, _: unknown, target: string, ...args: unknown[]) {
    const column = this as any;

    if (target === 'headerFilter' && value === 'weekends') {
      return [[AppComponent.getOrderDay, '=', 0], 'or', [AppComponent.getOrderDay, '=', 6]];
    }

    return column.defaultCalculateFilterExpression.apply(this, [value, _, target, ...args]);
  }

  readonly orderHeaderFilter = ({ dataSource }) => {
    dataSource.postProcess = (results: unknown[]) => {
      results.push({
        text: 'Weekends',
        value: 'weekends',
      });
      return results;
    };
  };

  clearFilter() {
    this.dataGrid().instance.clearFilter();
  }
}

bootstrapApplication(AppComponent);
