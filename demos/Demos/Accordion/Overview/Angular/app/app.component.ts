import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxAccordionModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule, DxTemplateModule,
} from 'devextreme-angular';

import { Company, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  companies: Company[];

  constructor(service: Service) {
    this.companies = service.getCompanies();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxAccordionModule,
    DxCheckBoxModule,
    DxSliderModule,
    DxTagBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
