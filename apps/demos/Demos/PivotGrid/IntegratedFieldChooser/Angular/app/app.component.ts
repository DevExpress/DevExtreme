import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  styleUrls: ['./app.component.css'],
  selector: 'demo-app',
  templateUrl: './app.component.html',
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
      catalog: 'Adventure Works DW Standard Edition',
      cube: 'Adventure Works',
    },
  };

  applyChangesModes: DxPivotGridTypes.ApplyChangesMode[] = ['instantly', 'onDemand'];

  applyChangesMode = this.applyChangesModes[0];
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
