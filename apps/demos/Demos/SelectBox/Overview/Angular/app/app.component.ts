import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
  imports: [
    DxSelectBoxModule,
    DxTextBoxModule,
  ],
})
export class AppComponent {
  simpleProducts: string[];

  products: Product[];

  data: ArrayStore;

  constructor(service: Service) {
    this.products = service.getProducts();
    this.simpleProducts = service.getSimpleProducts();
    this.data = new ArrayStore({
      data: this.products,
      key: 'ID',
    });
  }

  onValueChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    notify(`The value is changed to: "${value}"`);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
