import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxHtmlEditorModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

import { Service, TabConfig } from './app.service';

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
    DxHtmlEditorModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
