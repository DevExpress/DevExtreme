import { bootstrapApplication } from '@angular/platform-browser';
import {
  ChangeDetectorRef, Component, enableProdMode, signal,
} from '@angular/core';
import {
  DxSelectBoxModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

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
    DxSelectBoxModule,
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  simpleProducts: string[];

  products: Product[];

  isLoaded = signal(true);

  selectedItem: Product;

  deferredProducts = {
    loadMode: 'raw',
    load: () => {
      this.isLoaded.set(false);
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.simpleProducts);
          this.isLoaded.set(true);
        }, 3000);
      });

      return promise;
    },
  };

  constructor(service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.products = service.getProducts();
    this.selectedItem = this.products[0];
    this.simpleProducts = service.getSimpleProducts();
  }
}

bootstrapApplication(AppComponent);
