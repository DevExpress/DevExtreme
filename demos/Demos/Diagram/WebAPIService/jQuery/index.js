$(() => {
  const url = 'https://js.devexpress.com/Demos/Mvc/api/DiagramEmployees';
  const dataSource = DevExpress.data.AspNet.createStore({
    key: 'ID',
    loadUrl: `${url}/Employees`,
    insertUrl: `${url}/InsertEmployee`,
    updateUrl: `${url}/UpdateEmployee`,
    deleteUrl: `${url}/DeleteEmployee`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
    onInserting(values) {
      values.ID = 0;
      values.Title = values.Title || 'New Position';
      values.Prefix = 'Mr';
      values.FullName = 'New Employee';
      values.City = 'LA';
      values.State = 'CA';
      values.HireDate = new Date();
    },
  });
  $('#diagram').dxDiagram({
    nodes: {
      dataSource,
      keyExpr: 'ID',
      textExpr: 'Title',
      parentKeyExpr: 'HeadID',
      autoLayout: {
        type: 'tree',
      },
    },
    contextToolbox: {
      shapeIconsPerRow: 2,
      width: 100,
      shapes: ['rectangle'],
    },
    toolbox: {
      shapeIconsPerRow: 2,
      groups: [
        { title: 'Items', shapes: ['rectangle'] },
      ],
      showSearch: false,
    },
  });
});
