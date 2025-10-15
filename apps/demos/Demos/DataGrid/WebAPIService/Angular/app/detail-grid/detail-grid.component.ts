import { Component, Input, AfterViewInit } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'detail-grid',
  templateUrl: `.${modulePrefix && (`${modulePrefix}/detail-grid`)}/detail-grid.component.html`,
  providers: [],
})
export class DetailGridComponent implements AfterViewInit {
  @Input() key: number;

  dataSource: DataSource;

  ngAfterViewInit() {
    this.dataSource = new DataSource({
      store: AspNetData.createStore({
        loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/OrderDetails',
        loadParams: { orderID: this.key },
        onBeforeSend(method, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        },
      }),
    });
  }
}
