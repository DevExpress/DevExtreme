import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTagBoxModule, DxPopoverModule, DxTemplateModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import { Service, Product } from './app.service';

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
  simpleProducts: string[];

  editableProducts: string[];

  dataSource: ArrayStore;

  product: Product;

  value: number[];

  target: EventTarget;

  visible = false;

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      data: service.getProducts(),
      key: 'Id',
    });
    this.simpleProducts = service.getSimpleProducts();
    this.editableProducts = this.simpleProducts.slice();
    this.value = [1, 2];
  }

  onCustomItemCreating(args: DxTagBoxTypes.CustomItemCreatingEvent) {
    const newValue = args.text;
    const isItemInDataSource = this.editableProducts.some((item) => item === newValue);
    if (!isItemInDataSource) {
      this.editableProducts.unshift(newValue);
    }
    args.customItem = newValue;
  }

  onMouseEnter({ target }: MouseEvent, product: Product) {
    this.target = target;
    this.product = product;
    this.visible = true;
  }

  onMouseLeave() {
    this.target = null;
    this.visible = false;
  }

  isDisabled(product: Product) {
    return product.Name === 'SuperHD Video Player';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTemplateModule,
    DxTagBoxModule,
    DxPopoverModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
