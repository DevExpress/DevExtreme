import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxSelectBoxModule,
  DxLoadIndicatorModule,
  DxTemplateModule,
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
      const promise = new Promise((resolve, reject) => {
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

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxLoadIndicatorModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
