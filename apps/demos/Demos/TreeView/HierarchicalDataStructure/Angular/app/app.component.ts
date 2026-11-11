import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxTreeViewModule, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
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
  ],
})
export class AppComponent {
  readonly products: Product[] = inject(Service).getProducts();

  readonly currentItem = signal<Product>(this.products[0]);

  selectItem(e: DxTreeViewTypes.ItemClickEvent<Product>) {
    this.currentItem.set(e.itemData);
  }
}

bootstrapApplication(AppComponent);
