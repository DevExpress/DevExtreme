import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { Service, Employee } from './app.service';

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
  employees: Employee[];

  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(service: Service, http: HttpClient) {
    this.employees = service.getEmployees();

    http.get('../../../../data/diagram-employees.json').subscribe({
      next: (data) => { this.diagram.instance.import(JSON.stringify(data)); },
      error: (err) => { throw 'Data Loading Error'; },
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
