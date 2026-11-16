import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxBarGaugeModule, DxCheckBoxModule } from 'devextreme-angular';

import { type Product, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const getActiveCounts = (products: Product[]) => products
  .filter(({ active }) => active)
  .map(({ count }) => count);

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
  readonly products = inject(Service).getProducts();

  readonly values = signal(getActiveCounts(this.products));

  productsToValues() {
    this.values.set(getActiveCounts(this.products));
  }
}

bootstrapApplication(AppComponent);
