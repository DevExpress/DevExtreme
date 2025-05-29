import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule, DxCardViewTypes } from 'devextreme-angular/ui/card-view';
import { Order, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

function getOrderDay(rowData: Order) {
  return new Date(rowData.OrderDate).getDay();
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
})
export class AppComponent {
  // TODO: make nested
  headerFilterConfig = {
    visible: true
  };

  // TODO: make nested
  orderDateHeaderFilterConfig = {
    dataSource(data) {
      data.dataSource.postProcess = function (results) {
        results.push({
          text: 'Weekends',
          value: 'weekends',
        });
        return results;
      };
    },
  };

  // TODO: make nested
  saleAmountHeaderFilterConfig = {
    dataSource: [
      {
        text: 'Less than $3000',
        value: ['SaleAmount', '<', 3000],
      },
      {
        text: '$3000 - $5000',
        value: [
          ['SaleAmount', '>=', 3000],
          ['SaleAmount', '<', 5000],
        ],
      },
      {
        text: '$5000 - $10000',
        value: [
          ['SaleAmount', '>=', 5000],
          ['SaleAmount', '<', 10000],
        ],
      },
      {
        text: '$10000 - $20000',
        value: [
          ['SaleAmount', '>=', 10000],
          ['SaleAmount', '<', 20000],
        ],
      },
      {
        text: 'Greater than $20000',
        value: ['SaleAmount', '>=', 20000],
      },
    ],
  };

  // TODO: make nested
  storeCityHeaderFilterConfig = {
    search: {
      enabled: true,
      editorOptions: {
        placeholder: 'Search city or state',
      },
      searchExpr: ['StoreCity', 'StoreState'],
    },
  };

  // TODO: make nested
  storeStateHeaderFilterConfig = {
    search: {
      enabled: true,
      editorOptions: {
        placeholder: 'Search state or city',
      },
      searchExpr: ['StoreState', 'StoreCity'],
    },
  };

  // TODO: make nested
  orderNumberHeaderFilterConfig = { groupInterval: 10000 };

  calculateOrderDateFilterExpression(this: DxCardViewTypes.Column, value, selectedFilterOperations, target) {
    if (value === 'weekends') {
      return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
    }
    return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
  }

  orders: Order[];

  constructor(service: Service) {
    this.orders = service.getOrders();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
