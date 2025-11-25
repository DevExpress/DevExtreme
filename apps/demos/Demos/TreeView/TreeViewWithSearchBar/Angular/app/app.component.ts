import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeViewModule, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
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
    DxTreeViewModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  products: Product[];

  currentItem: Product;

  constructor(service: Service) {
    this.products = service.getProducts();
    this.currentItem = this.products[0];
  }

  selectItem(e: DxTreeViewTypes.ItemClickEvent<Product>) {
    this.currentItem = e.itemData;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
