import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
})
export class AppComponent {
  products: Product[];

  currentItem: Product;

  constructor(service: Service) {
    this.products = service.getProducts();
    this.currentItem = this.products[0];
  }

  selectItem(e: DxTreeViewTypes.ItemClickEvent) {
    this.currentItem = e.itemData as Product;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTreeViewModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
