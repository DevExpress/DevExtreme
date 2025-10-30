import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {provideHttpClient, withFetch} from '@angular/common/http';

import { DxDiagramModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { Service } from './app.service';

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
  preserveWhitespaces: true,
})
export class AppComponent {
  flowNodesDataSource: ArrayStore;

  flowEdgesDataSource: ArrayStore;

  constructor(service: Service) {
    this.flowNodesDataSource = new ArrayStore({
      key: 'id',
      data: service.getFlowNodes(),
    });
    this.flowEdgesDataSource = new ArrayStore({
      key: 'id',
      data: service.getFlowEdges(),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDiagramModule,
  ],
  providers: [provideHttpClient(withFetch())],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
