import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';

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
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(http: HttpClient) {
    http.get('../../../../data/diagram-structure.json').subscribe({
      next: (data) => { this.diagram.instance.import(JSON.stringify(data)); },
      error: () => { throw 'Data Loading Error'; },
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
