import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTagBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

import { Product, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  products: Product[];

  slicedProducts: Product[];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.slicedProducts = this.products.slice(0, 5);
  }

  onMultiTagPreparing(args) {
    const selectedItemsLength = args.selectedItems.length;
    const totalCount = 5;

    if (selectedItemsLength < totalCount) {
      args.cancel = true;
    } else {
      args.text = `All selected (${selectedItemsLength})`;
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTagBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
