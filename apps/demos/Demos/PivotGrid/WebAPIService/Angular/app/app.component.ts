import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  dataSource: DataSourceConfig = {
    remoteOperations: true,
    store: AspNetData.createStore({
      key: 'OrderID',
      loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales/Orders',
    }),
    fields: [{
      caption: 'Category',
      dataField: 'ProductCategoryName',
      width: 250,
      expanded: true,
      sortBySummaryField: 'SalesAmount',
      sortBySummaryPath: [],
      sortOrder: 'desc',
      area: 'row',
    }, {
      caption: 'Subcategory',
      dataField: 'ProductSubcategoryName',
      width: 250,
      sortBySummaryField: 'SalesAmount',
      sortBySummaryPath: [],
      sortOrder: 'desc',
      area: 'row',
    }, {
      caption: 'Product',
      dataField: 'ProductName',
      area: 'row',
      sortBySummaryField: 'SalesAmount',
      sortBySummaryPath: [],
      sortOrder: 'desc',
      width: 250,
    }, {
      caption: 'Date',
      dataField: 'DateKey',
      dataType: 'date',
      area: 'column',
    }, {
      caption: 'Amount',
      dataField: 'SalesAmount',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    }, {
      caption: 'Store',
      dataField: 'StoreName',
    }, {
      caption: 'Quantity',
      dataField: 'SalesQuantity',
      summaryType: 'sum',
    }, {
      caption: 'Unit Price',
      dataField: 'UnitPrice',
      format: 'currency',
      summaryType: 'sum',
    }, {
      dataField: 'Id',
      visible: false,
    }],
  };
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
