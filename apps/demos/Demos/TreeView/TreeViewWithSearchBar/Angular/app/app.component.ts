import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeViewModule } from 'devextreme-angular/ui/tree-view';
import type { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { type Product, Service } from './app.service';

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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly products: Product[] = inject(Service).getProducts();

  currentItem: Product = this.products[0];

  selectItem(e: DxTreeViewTypes.ItemClickEvent<Product>) {
    this.currentItem = e.itemData;
  }
}

bootstrapApplication(AppComponent);
