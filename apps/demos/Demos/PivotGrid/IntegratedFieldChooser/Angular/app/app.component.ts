import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxSelectBoxModule } from 'devextreme-angular';
import { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  styleUrls: [`.${modulePrefix}/app.component.css`],
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  imports: [
    DxPivotGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  dataSource: DataSourceConfig = {
    fields: [
      { dataField: '[Product].[Category]', area: 'row' },
      {
        dataField: '[Product].[Subcategory]',
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
      },
      { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
      { dataField: '[Ship Date].[Month of Year]', area: 'column' },
      { dataField: '[Measures].[Customer Count]', area: 'data' },
    ],
    store: {
      type: 'xmla',
      url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
      catalog: 'Adventure Works DW Standard Edition 2026',
      cube: 'Adventure Works',
    },
  };

  applyChangesModes: DxPivotGridTypes.ApplyChangesMode[] = ['instantly', 'onDemand'];

  applyChangesMode = this.applyChangesModes[0];
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
