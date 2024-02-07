const statuses = [{
  id: 1, name: 'Not Started',
}, {
  id: 2, name: 'In Progress',
}, {
  id: 3, name: 'Deferred',
}, {
  id: 4, name: 'Need Assistance',
}, {
  id: 5, name: 'Completed',
},
];

const url = 'https://js.devexpress.com/Demos/Mvc/api/CustomEditors';

const employees = DevExpress.data.AspNet.createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
