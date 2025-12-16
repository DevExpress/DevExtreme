import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxMenuModule, type DxMenuTypes } from 'devextreme-angular/ui/menu';

import { Service, type Product, type ProductItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

const isProductItem = (item: Product | ProductItem): item is ProductItem =>
  !('items' in item);

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxMenuModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  products: Product[];

  showSubmenuModes = [{
    name: 'onHover' as DxMenuTypes.SubmenuShowMode,
    delay: { show: 0, hide: 500 },
  }, {
    name: 'onClick' as DxMenuTypes.SubmenuShowMode,
    delay: { show: 0, hide: 300 },
  }];

  showFirstSubmenuModes = this.showSubmenuModes[1];

  currentProduct: ProductItem;

  constructor(service: Service) {
    this.products = service.getProducts();
  }

  itemClick(data: DxMenuTypes.ItemClickEvent<Product>) {
    const item = data.itemData;

    if (isProductItem(item)) {
      this.currentProduct = item;
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
