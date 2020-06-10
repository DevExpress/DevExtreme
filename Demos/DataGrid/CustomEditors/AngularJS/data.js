var statuses = [{
    "id": 1, "name": "Not Started"
  }, {
    "id": 2, "name": "In Progress"
  }, {
    "id": 3, "name": "Deferred"
  }, {
    "id": 4, "name": "Need Assistance"
  }, {
    "id": 5, "name": "Completed"
  }
];

var url = "https://js.devexpress.com/Demos/Mvc/api/CustomEditors";

var employees = DevExpress.data.AspNet.createStore({
    key: "ID",
    loadUrl: url + "/Employees",
    onBeforeSend: function(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    }
});