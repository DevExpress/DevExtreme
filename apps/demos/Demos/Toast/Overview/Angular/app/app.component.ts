import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule, DxToastModule } from 'devextreme-angular';
import { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
})
export class AppComponent {
  products: Product[];

  isVisible = false;

  type = 'info';

  message = '';

  constructor(service: Service) {
    this.products = service.getProducts();
  }

  checkAvailable({ value }: DxCheckBoxTypes.ValueChangedEvent, product: Product) {
    this.type = value ? 'success' : 'error';
    this.message = product.Name + (value ? ' is available' : ' is not available');
    this.isVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCheckBoxModule,
    DxToastModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
