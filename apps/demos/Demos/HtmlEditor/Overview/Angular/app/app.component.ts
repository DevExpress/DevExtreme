import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

import { Service, TabConfig } from './app.service';

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
  isMultiline = true;

  valueContent: string;

  tabs: TabConfig[];

  currentTab: string[];

  constructor(service: Service) {
    this.valueContent = service.getMarkup();
    this.tabs = service.getTabsData();
    this.currentTab = this.tabs[2].value;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxHtmlEditorModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
