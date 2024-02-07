const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
  const url = `${BASE_PATH}api/DataGridCollaborativeEditing/`;
  const groupId = new DevExpress.data.Guid().toJSON();

  const createStore = function () {
    return DevExpress.data.AspNet.createStore({
      key: 'ID',
      loadUrl: url,
      insertUrl: url,
      updateUrl: url,
      deleteUrl: url,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.data.groupId = groupId;
      },
    });
  };

  const createDataGridOptions = function (store) {
    return {
      dataSource: store,
      height: 600,
      showBorders: true,
      repaintChangesOnly: true,
      highlightChanges: true,
      paging: {
        enabled: false,
      },
      editing: {
        mode: 'cell',
        refreshMode: 'reshape',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
      },
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 50,
          validationRules: [{ type: 'required' }],
        },
        {
          dataField: 'FirstName',
          validationRules: [{ type: 'required' }],
        },
        {
          dataField: 'StateID',
          caption: 'State',
          lookup: {
            dataSource: DevExpress.data.AspNet.createStore({
              key: 'ID',
              loadUrl: `${BASE_PATH}api/DataGridStatesLookup`,
            }),
            displayExpr: 'Name',
            valueExpr: 'ID',
          },
          validationRules: [{ type: 'required' }],
        },
        {
          dataField: 'BirthDate',
          dataType: 'date',
          validationRules: [{
            type: 'range',
            max: new Date(3000, 0),
            message: 'Date can not be greater than 01/01/3000',
          }],
        },
      ],
    };
  };

  const store1 = createStore();
  const store2 = createStore();

  const updateStores = function (events) {
    store1.push(events);
    store2.push(events);
  };

  $scope.dataGridOptions1 = createDataGridOptions(store1);
  $scope.dataGridOptions2 = createDataGridOptions(store2);

  const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${groupId}`;
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.start()
    .then(() => {
      connection.on('update', (key, data) => {
        updateStores([{ type: 'update', key, data }]);
      });

      connection.on('insert', (data) => {
        updateStores([{ type: 'insert', data }]);
      });

      connection.on('remove', (key) => {
        updateStores([{ type: 'remove', key }]);
      });
    });
});
