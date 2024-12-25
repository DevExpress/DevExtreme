import { Component, Input, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'detail-grid',
  templateUrl: `.${modulePrefix && (modulePrefix + '/detail-grid')}/detail-grid.component.html`,
  styleUrls: [`.${modulePrefix && (modulePrefix + '/detail-grid')}/detail-grid.component.css`],
  providers: [],
})
export class DetailGridComponent implements AfterViewInit {
  @Input() key: number;

  dataSource: DataSource;

  ngAfterViewInit() {
    this.dataSource = new DataSource({
      store: AspNetData.createStore({
        loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/OrderDetails',
        loadParams: { orderID: this.key },
        onBeforeSend(method, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        },
      }),
    });
  }
}
