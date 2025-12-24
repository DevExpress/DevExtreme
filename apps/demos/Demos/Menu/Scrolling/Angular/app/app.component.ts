import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxMenuModule, type DxMenuTypes } from 'devextreme-angular/ui/menu';
import notify from 'devextreme/ui/notify';

import { Service, type Product } from './app.service';

if (!document.location.host.includes('localhost')) {
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
    DxMenuModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  products: Product[];

  SUBMENU_HEIGHT = 200;

  limitSubmenuHeight = false;

  constructor(service: Service) {
    this.products = service.getProducts();
  }

  itemClick(e: DxMenuTypes.ItemClickEvent<Product>) {
    if (!e.itemData.items) {
      notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
    }
  }

  onSubmenuShowing({ submenuContainer }: DxMenuTypes.SubmenuShowingEvent) {
    submenuContainer.style.maxHeight = this.limitSubmenuHeight ? `${this.SUBMENU_HEIGHT}px` : '';
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
