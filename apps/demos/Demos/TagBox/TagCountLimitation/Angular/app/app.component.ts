import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTagBoxModule, DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxTagBoxModule,
  ],
})

export class AppComponent {
  products: Product[];

  slicedProducts: Product[];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.slicedProducts = this.products.slice(0, 5);
  }

  onMultiTagPreparing(args: DxTagBoxTypes.MultiTagPreparingEvent) {
    const selectedItemsLength = args.selectedItems.length;
    const totalCount = 5;

    if (selectedItemsLength < totalCount) {
      args.cancel = true;
    } else {
      args.text = `All selected (${selectedItemsLength})`;
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
