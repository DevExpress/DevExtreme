const DemoApp = angular.module('DemoApp', ['dx']);

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

DemoApp.controller('DemoController', ($scope) => {
  const ordersStore = new DevExpress.data.CustomStore({
    key: 'OrderID',
    load() {
      return sendRequest(`${URL}/Orders`);
    },
    insert(values) {
      return sendRequest(`${URL}/InsertOrder`, 'POST', {
        values: JSON.stringify(values),
      });
    },
    update(key, values) {
      return sendRequest(`${URL}/UpdateOrder`, 'PUT', {
        key,
        values: JSON.stringify(values),
      });
    },
    remove(key) {
      return sendRequest(`${URL}/DeleteOrder`, 'DELETE', {
        key,
      });
    },
  });

  $scope.refreshMode = 'reshape';
  $scope.requests = [];

  $scope.gridOptions = {
    bindingOptions: {
      'editing.refreshMode': 'refreshMode',
    },
    dataSource: ordersStore,
    repaintChangesOnly: true,
    showBorders: true,
    editing: {
      mode: 'cell',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    scrolling: {
      mode: 'virtual',
    },
    columns: [{
      dataField: 'CustomerID',
      caption: 'Customer',
      lookup: {
        dataSource: {
          paginate: true,
          store: new DevExpress.data.CustomStore({
            key: 'Value',
            loadMode: 'raw',
            load() {
              return sendRequest(`${URL}/CustomersLookup`);
            },
          }),
        },
        valueExpr: 'Value',
        displayExpr: 'Text',
      },
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'Freight',
    }, {
      dataField: 'ShipCountry',
    }, {
      dataField: 'ShipVia',
      caption: 'Shipping Company',
      dataType: 'number',
      lookup: {
        dataSource: new DevExpress.data.CustomStore({
          key: 'Value',
          loadMode: 'raw',
          load() {
            return sendRequest(`${URL}/ShippersLookup`);
          },
        }),
        valueExpr: 'Value',
        displayExpr: 'Text',
      },
    },
    ],
    summary: {
      totalItems: [{
        column: 'CustomerID',
        summaryType: 'count',
      }, {
        column: 'Freight',
        valueFormat: '#0.00',
        summaryType: 'sum',
      }],
    },
  };

  $scope.selectBoxOptions = {
    bindingOptions: {
      value: 'refreshMode',
    },
    items: ['full', 'reshape', 'repaint'],
  };

  $scope.buttonOptions = {
    text: 'Clear',
    onClick() {
      $scope.requests = [];
    },
  };

  function sendRequest(url, method, data) {
    const d = $.Deferred();

    method = method || 'GET';

    logRequest(method, url, data);

    $.ajax(url, {
      method: method || 'GET',
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
      d.resolve(method === 'GET' ? result.data : result);
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }

  function logRequest(method, url, data) {
    const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

    const time = DevExpress.localization.formatDate(new Date(), 'HH:mm:ss');

    $scope.requests.unshift([time, method, url.slice(URL.length), args].join(' '));
  }
});
