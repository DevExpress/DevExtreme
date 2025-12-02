import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule } from 'devextreme-angular/ui/card-view';
import { Order, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

function getOrderDay({ OrderDate }: Order): number {
  return (new Date(OrderDate)).getDay();
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
})
export class AppComponent {
  filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'weekends']];

  customOperations = [{
    name: 'weekends',
    caption: 'Weekends',
    dataTypes: ['date'],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression() {
      return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
    },
  }];

  saleAmountHeaderFilterDataSource = [
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
  ];

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
