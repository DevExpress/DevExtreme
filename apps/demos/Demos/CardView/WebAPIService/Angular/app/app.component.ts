import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  dataSource: any;

  columns = [
    { dataField: 'OrderID' },
    { dataField: 'OrderDate' },
    { dataField: 'ShippedDate' },
    { dataField: 'Freight' },
    { dataField: 'ShipName' },
    { dataField: 'ShipCity' },
    { dataField: 'ShipCountry' },
  ];

  paging = {
    pageSize: 6,
  };

  pager = {
    allowedPageSizes: [3, 6, 9, 12, 30],
    showInfo: true,
    showNavigationButtons: true,
    showPageSizeSelector: true,
    visible: true,
  };

  constructor() {
    this.dataSource = AspNetData.createStore({
      key: 'OrderID',
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/Orders',
    });
  }
}

@NgModule({
  imports: [BrowserModule, DxCardViewModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
