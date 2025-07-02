import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule, DxSelectBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
})
export class AppComponent {
  dataSource = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${url}/Tasks`,
    insertUrl: `${url}/InsertTask`,
    updateUrl: `${url}/UpdateTask`,
    deleteUrl: `${url}/DeleteTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
