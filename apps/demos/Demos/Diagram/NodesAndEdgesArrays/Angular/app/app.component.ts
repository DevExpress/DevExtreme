import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

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
  imports: [
    DxDiagramModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
