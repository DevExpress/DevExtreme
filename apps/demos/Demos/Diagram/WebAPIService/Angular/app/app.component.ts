import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDiagramModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';

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
  imports: [
    DxDiagramModule,
  ],
})
export class AppComponent {
  url: string;

  dataSource: AspNetData.CustomStore;

  constructor() {
    this.url = 'https://js.devexpress.com/Demos/NetCore/api/DiagramEmployees';

    this.dataSource = AspNetData.createStore({
      key: 'ID',
      loadUrl: `${this.url}/Employees`,
      insertUrl: `${this.url}/InsertEmployee`,
      updateUrl: `${this.url}/UpdateEmployee`,
      deleteUrl: `${this.url}/DeleteEmployee`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
      onInserting(values) {
        values.ID = 0;
        values.Title = values.Title || 'New Position';
        values.Prefix = 'Mr';
        values.FullName = 'New Employee';
        values.City = 'LA';
        values.State = 'CA';
        values.HireDate = new Date();
      },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
