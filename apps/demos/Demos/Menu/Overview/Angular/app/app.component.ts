import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxMenuModule, type DxMenuTypes } from 'devextreme-angular/ui/menu';

import { Service, type Product, type ProductItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const isProductItem = (item: Product | ProductItem): item is ProductItem =>
  !('items' in item);

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxMenuModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly products = inject(Service).getProducts();

  readonly showSubmenuModes = [{
    name: 'onHover' as DxMenuTypes.SubmenuShowMode,
    delay: { show: 0, hide: 500 },
  }, {
    name: 'onClick' as DxMenuTypes.SubmenuShowMode,
    delay: { show: 0, hide: 300 },
  }];

  readonly showFirstSubmenuModes = signal(this.showSubmenuModes[1]);

  readonly currentProduct = signal<ProductItem | undefined>(undefined);

  itemClick(data: DxMenuTypes.ItemClickEvent<Product>) {
    const item = data.itemData;

    if (isProductItem(item)) {
      this.currentProduct.set(item);
    }
  }
}

bootstrapApplication(AppComponent);
