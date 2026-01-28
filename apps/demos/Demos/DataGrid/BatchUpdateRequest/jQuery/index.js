$(async () => {
  const URL = 'https://js.devexpress.com/Demos/NetCore/api/DataGridBatchUpdateWebApi';

  $('#gridContainer').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'OrderID',
      loadUrl: `${URL}/Orders`,
    }),
    pager: {
      visible: true,
    },
    showBorders: true,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
    },
    remoteOperations: true,
    repaintChangesOnly: true,
    onSaving(e) {
      e.cancel = true;

      if (e.changes.length) {
        const changes = normalizeChanges(e.changes);
        e.promise = sendBatchRequest(`${URL}/Batch`, changes).done(() => {
          e.component.refresh(true).done(() => {
            e.component.cancelEditData();
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
  });

  function normalizeChanges(changes) {
    return changes.map((c) => {
      switch (c.type) {
        case 'insert':
          return {
            type: c.type,
            data: c.data,
          };
        case 'update':
          return {
            type: c.type,
            key: c.key,
            data: c.data,
          };
        case 'remove':
          return {
            type: c.type,
            key: c.key,
          };
        default:
          return c;
      }
    });
  }

  function sendBatchRequest(url, changes) {
    const d = $.Deferred();

    $.ajax(url, {
      method: 'POST',
      data: JSON.stringify(changes),
      cache: false,
      contentType: 'application/json',
    }).done(d.resolve).fail((xhr) => {
      const errorMessage = xhr.responseText || xhr.statusText || 'Unknown error';
      d.reject(new Error(`Batch save failed: ${errorMessage}`));
    });

    return d.promise();
  }
});
