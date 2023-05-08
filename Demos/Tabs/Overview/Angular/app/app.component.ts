import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTabsModule, DxSelectBoxModule } from 'devextreme-angular';

import { Tab, Longtab, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  longtabs: Longtab[];

  tabs: Tab[];

  tabContent: string;

  constructor(service: Service) {
    this.longtabs = service.getLongtabs();
    this.tabs = service.getTabs();
    this.tabContent = this.tabs[0].content;
  }

  selectTab(e) {
    this.tabContent = this.tabs[e.itemIndex].content;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTabsModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
