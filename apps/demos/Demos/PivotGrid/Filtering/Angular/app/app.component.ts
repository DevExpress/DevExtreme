import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

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
    DxPivotGridModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  pivotGridDataSource: PivotGridDataSource;

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
          filterValues: ['[Ship Date].[Calendar Year].&[2024]'],
        },
      ],
      store: {
        type: 'xmla',
        url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        catalog: 'Adventure Works DW Standard Edition 2026',
        cube: 'Adventure Works',
      },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
