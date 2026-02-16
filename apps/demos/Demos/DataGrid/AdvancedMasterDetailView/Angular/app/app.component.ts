import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule,
} from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DataSource } from 'devextreme-angular/common/data';
import { DetailViewComponent } from './detail-view/detail-view.component';

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
  imports: [
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTabPanelModule,
    DetailViewComponent,
  ],
})
export class AppComponent {
  url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridAdvancedMasterDetailView';

  suppliersData: DataSource;

  constructor() {
    this.suppliersData = new DataSource({
      store: AspNetData.createStore({
        key: 'SupplierID',
        loadUrl: `${this.url}/GetSuppliers`,
      }),
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
