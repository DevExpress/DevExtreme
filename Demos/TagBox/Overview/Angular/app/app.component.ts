import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTagBoxModule, DxTemplateModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';

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

  dataSource: any;

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      data: service.getProducts(),
      key: 'Id',
    });
    this.simpleProducts = service.getSimpleProducts();
    this.editableProducts = this.simpleProducts.slice();
  }

  onCustomItemCreating(args) {
    const newValue = args.text;
    const isItemInDataSource = this.editableProducts.some((item) => item === newValue);
    if (!isItemInDataSource) {
      this.editableProducts.unshift(newValue);
    }
    args.customItem = newValue;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTemplateModule,
    DxTagBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
