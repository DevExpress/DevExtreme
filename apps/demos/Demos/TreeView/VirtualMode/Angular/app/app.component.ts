import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeViewModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

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
  imports: [DxTreeViewModule],
})
export class AppComponent {
  dataSource = AspNetData.createStore({
    loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/TreeViewPlainData',
    key: 'ID',
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
