import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxHtmlEditorComponent,
  DxoHtmlEditorToolbarComponent,
  DxiHtmlEditorToolbarItemComponent,
  DxoHtmlEditorImageUploadComponent,
  DxoHtmlEditorMediaResizingComponent,
} from 'devextreme-angular/ui/html-editor';

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
    DxHtmlEditorComponent,
    DxoHtmlEditorToolbarComponent,
    DxiHtmlEditorToolbarItemComponent,
    DxoHtmlEditorImageUploadComponent,
    DxoHtmlEditorMediaResizingComponent,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
