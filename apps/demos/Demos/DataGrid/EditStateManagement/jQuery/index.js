$(() => {
  const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

  const loadPanel = $('#loadPanel').dxLoadPanel({
    position: {
      of: '#gridContainer',
    },
    visible: false,
  }).dxLoadPanel('instance');

  loadPanel.show();
  sendRequest(`${URL}/Orders?skip=700`)
    .always(() => { loadPanel.hide(); })
    .then((data) => {
      dataGrid.option('dataSource', data);
    });

  const dataGrid = $('#gridContainer').dxDataGrid({
    keyExpr: 'OrderID',
    showBorders: true,
    dataSource: [],
    editing: {
      mode: 'row',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    repaintChangesOnly: true,
    onOptionChanged(e) {
      if (e.name === 'editing') {
        const editRowKey = e.component.option('editing.editRowKey');
        let changes = e.component.option('editing.changes');

        $('#editRowKey').text(editRowKey === null ? 'null' : editRowKey);

        changes = changes.map((change) => ({
          type: change.type,
          key: change.type !== 'insert' ? change.key : undefined,
          data: change.data,
        }));

        $('#changes').text(JSON.stringify(changes, null, ' '));
      }
    },
    onSaving(e) {
      const change = e.changes[0];

      if (change) {
        e.cancel = true;
        loadPanel.show();
        e.promise = saveChange(URL, change)
          .always(() => { loadPanel.hide(); })
          .then((data) => {
            let orders = e.component.option('dataSource');

            if (change.type === 'insert') {
              change.data = data;
            }
            orders = DevExpress.data.applyChanges(orders, [change], { keyExpr: 'OrderID' });

            e.component.option({
              dataSource: orders,
              editing: {
                editRowKey: null,
                changes: [],
              },
            });
          });
      }
    },
    columns: [{
      dataField: 'OrderID',
      allowEditing: false,
    }, {
      dataField: 'ShipName',
    }, {
      dataField: 'ShipCountry',
    }, {
      dataField: 'ShipCity',
    }, {
      dataField: 'ShipAddress',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'Freight',
    }],
  }).dxDataGrid('instance');

  function saveChange(url, change) {
    switch (change.type) {
      case 'insert':
        return sendRequest(`${url}/InsertOrder`, 'POST', { values: JSON.stringify(change.data) });
      case 'update':
        return sendRequest(`${url}/UpdateOrder`, 'PUT', { key: change.key, values: JSON.stringify(change.data) });
      case 'remove':
        return sendRequest(`${url}/DeleteOrder`, 'DELETE', { key: change.key });
      default:
        return null;
    }
  }

  function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();

    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).then((result) => {
      d.resolve(method === 'GET' ? result.data : result);
    }, (xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }
});
