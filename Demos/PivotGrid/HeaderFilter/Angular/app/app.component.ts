import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  pivotGridDataSource: any;

  searchEnabled = true;

  showRelevantValues = true;

  constructor() {
    this.pivotGridDataSource = new PivotGridDataSource({
      fields: [
        { dataField: '[Product].[Category]', area: 'column' },
        { dataField: '[Product].[Subcategory]', area: 'column' },
        { dataField: '[Customer].[City]', area: 'row' },
        { dataField: '[Measures].[Internet Total Product Cost]', area: 'data', format: 'currency' },
        {
          dataField: '[Customer].[Country]',
          area: 'filter',
          filterValues: ['[Customer].[Country].&[United Kingdom]'],
        },
        {
          dataField: '[Ship Date].[Calendar Year]',
          area: 'filter',
          filterValues: ['[Ship Date].[Calendar Year].&[2004]'],
        },
      ],
      store: {
        type: 'xmla',
        url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        catalog: 'Adventure Works DW Standard Edition',
        cube: 'Adventure Works',
      },
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
