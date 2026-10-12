import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxBarGaugeModule, DxCheckBoxModule } from 'devextreme-angular';

import { Product, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxBarGaugeModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  products: Product[];

  values: Product[];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.productsToValues();
  }

  productsToValues() {
    const values = [];

    this.products.forEach((product) => {
      if (product.active) {
        values.push(product.count);
      }
    });

    this.values = values;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
