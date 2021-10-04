const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const dataSource = DevExpress.data.AspNet.createStore({
  key: 'OrderID',
  loadUrl: `${url}/Orders`,
  insertUrl: `${url}/InsertOrder`,
  updateUrl: `${url}/UpdateOrder`,
  deleteUrl: `${url}/DeleteOrder`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
