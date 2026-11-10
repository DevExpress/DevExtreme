import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxDiagramModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const url = 'https://js.devexpress.com/Demos/NetCore/api/DiagramEmployees';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxDiagramModule,
  ],
})
export class AppComponent {
  readonly dataSource = AspNetData.createStore({
    key: 'ID',
    loadUrl: `${url}/Employees`,
    insertUrl: `${url}/InsertEmployee`,
    updateUrl: `${url}/UpdateEmployee`,
    deleteUrl: `${url}/DeleteEmployee`,
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

bootstrapApplication(AppComponent);
