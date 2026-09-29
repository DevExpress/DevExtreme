import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeViewModule, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
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
    DxTreeViewModule,
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
