import {
  NgModule, Component, enableProdMode, ChangeDetectionStrategy,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule, DxSliderModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

import { Product, Order, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  productsDataSource: DataSource;

  orders: ArrayStore;

  updatesPerSecond = 100;

  constructor(service: Service) {
    this.productsDataSource = new DataSource({
      store: service.getProducts(),
      reshapeOnPush: true,
    });

    this.orders = service.getOrders();

    setInterval(() => {
      if (service.getOrderCount() > 500000) {
        return;
      }

      for (let i = 0; i < this.updatesPerSecond / 20; i++) {
        service.addOrder();
      }
    }, 50);
  }

  getDetailGridDataSource(product: Product) {
    return new DataSource({
      store: this.orders,
      reshapeOnPush: true,
      filter: ['ProductID', '=', product.ProductID],
    });
  }

  getAmount(order: Order) {
    return order.UnitPrice * order.Quantity;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxSliderModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
