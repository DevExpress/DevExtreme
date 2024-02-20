$(() => {
  const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

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

  const dataGrid = $('#grid').dxDataGrid({
    dataSource: ordersStore,
    repaintChangesOnly: true,
    showBorders: true,
    editing: {
      refreshMode: 'reshape',
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
  }).dxDataGrid('instance');

  $('#refresh-mode').dxSelectBox({
    items: ['full', 'reshape', 'repaint'],
    value: 'reshape',
    inputAttr: { 'aria-label': 'Refresh Mode' },
    onValueChanged(e) {
      dataGrid.option('editing.refreshMode', e.value);
    },
  });

  $('#clear').dxButton({
    text: 'Clear',
    onClick() {
      $('#requests ul').empty();
    },
  });

  function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();

    logRequest(method, url, data);

    $.ajax(url, {
      method,
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

    const logList = $('#requests ul');
    const time = DevExpress.localization.formatDate(new Date(), 'HH:mm:ss');
    const newItem = $('<li>').text([time, method, url.slice(URL.length), args].join(' '));

    logList.prepend(newItem);
  }
});
