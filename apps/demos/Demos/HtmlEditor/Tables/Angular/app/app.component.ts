import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service } from './app.service';

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
  valueContent: string;

  allowResizing = true;

  contextMenuEnabled = true;

  constructor(service: Service) {
    this.valueContent = service.getMarkup();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxHtmlEditorModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
