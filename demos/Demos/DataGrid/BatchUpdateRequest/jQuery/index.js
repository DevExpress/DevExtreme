$(() => {
  const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridBatchUpdateWebApi';

  $('#gridContainer').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'OrderID',
      loadUrl: `${URL}/Orders`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
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
        e.promise = sendBatchRequest(`${URL}/Batch`, e.changes).done(() => {
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

  function sendBatchRequest(url, changes) {
    const d = $.Deferred();

    $.ajax(url, {
      method: 'POST',
      data: JSON.stringify(changes),
      cache: false,
      contentType: 'application/json',
      xhrFields: { withCredentials: true },
    }).done(d.resolve).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }
});
