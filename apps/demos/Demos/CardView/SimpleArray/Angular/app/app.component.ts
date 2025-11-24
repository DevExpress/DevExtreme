import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule } from 'devextreme-angular';
import { Customer, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
})
export class AppComponent {
  customers: Customer[];

  columns = ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'];

  constructor(service: Service) {
    this.customers = service.getCustomers();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
