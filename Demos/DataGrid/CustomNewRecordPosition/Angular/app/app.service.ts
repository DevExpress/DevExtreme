import { Injectable } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const dataSource = createStore({
  key: 'OrderID',
  loadUrl: `${url}/Orders`,
  insertUrl: `${url}/InsertOrder`,
  updateUrl: `${url}/UpdateOrder`,
  deleteUrl: `${url}/DeleteOrder`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

@Injectable()
export class Service {
  getDataSource() {
    return dataSource;
  }
}
