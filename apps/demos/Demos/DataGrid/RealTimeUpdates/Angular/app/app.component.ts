import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, ChangeDetectionStrategy, inject, signal,
} from '@angular/core';
import { DxDataGridModule, DxSliderModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { Product, Order, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxDataGridModule,
    DxSliderModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly productsDataSource = new DataSource({
    store: this.service.getProducts(),
    reshapeOnPush: true,
  });

  private readonly orders = this.service.getOrders();

  readonly updatesPerSecond = signal(100);

  constructor() {
    setInterval(() => {
      if (this.service.getOrderCount() > 500000) {
        return;
      }

      for (let i = 0; i < this.updatesPerSecond() / 20; i += 1) {
        this.service.addOrder();
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

bootstrapApplication(AppComponent);
