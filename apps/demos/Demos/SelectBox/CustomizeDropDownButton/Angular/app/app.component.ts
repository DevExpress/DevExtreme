import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxSelectBoxModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

import { Product, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxSelectBoxModule,
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  simpleProducts: string[];

  products: Product[];

  isLoaded = true;

  selectedItem: Product;

  deferredProducts = {
    loadMode: 'raw',
    load: () => {
      this.isLoaded = false;
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.simpleProducts);
          this.isLoaded = true;
        }, 3000);
      });

      return promise;
    },
  };

  constructor(service: Service) {
    this.products = service.getProducts();
    this.selectedItem = this.products[0];
    this.simpleProducts = service.getSimpleProducts();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
