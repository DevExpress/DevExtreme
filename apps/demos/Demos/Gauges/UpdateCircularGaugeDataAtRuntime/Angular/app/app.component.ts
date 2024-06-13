import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxCircularGaugeModule, DxSelectBoxModule } from 'devextreme-angular';

import { Data, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})

export class AppComponent {
  dataSource: Data[];

  value: Data;

  constructor(service: Service) {
    this.dataSource = service.getData();
    this.value = this.dataSource[0];
  }

  customizeText(arg) {
    return `${arg.valueText} °C`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCircularGaugeModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
