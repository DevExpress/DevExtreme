$(() => {
  $.type = $.type || function (obj) {
    if (obj == null) {
      return `${obj}`;
    }

    return typeof obj;
  };

  const BASE_PATH = 'http://localhost:5555';
  // const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore';
  const url = `${BASE_PATH}/api/DataGridCollaborativeEditing/`;
  const groupId = new DevExpress.data.Guid().toString();

  function fetchAntiForgeryToken() {
    return $.ajax({
      url: `${BASE_PATH}/api/Common/GetAntiForgeryToken`,
      method: 'GET',
      xhrFields: { withCredentials: true },
      cache: false,
    }).fail((xhr) => {
      const error = xhr.responseJSON?.message || xhr.statusText || 'Unknown error';
      throw new Error(`Failed to retrieve anti-forgery token: ${error}`);
    });
  }

  function getAntiForgeryTokenValue() {
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (tokenMeta) {
      const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
      const token = tokenMeta.getAttribute('content');
      return $.Deferred().resolve({ headerName, token });
    }

    return fetchAntiForgeryToken().then((tokenData) => {
      const meta = document.createElement('meta');
      meta.name = 'csrf-token';
      meta.content = tokenData.token;
      meta.dataset.headerName = tokenData.headerName;
      document.head.appendChild(meta);
      return tokenData;
    });
  }

  const createStore = function () {
    return DevExpress.data.AspNet.createStore({
      key: 'ID',
      loadUrl: url,
      insertUrl: url,
      updateUrl: url,
      deleteUrl: url,
      async onBeforeSend(_, ajaxOptions) {
        ajaxOptions.data.groupId = groupId;
        const tokenData = await getAntiForgeryTokenValue();
        ajaxOptions.xhrFields = {
          withCredentials: true,
          headers: { [tokenData.headerName]: tokenData.token },
        };
      },
    });
  };

  const createDataGrid = function (gridId, store) {
    $(`#${gridId}`).dxDataGrid({
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
              loadUrl: `${BASE_PATH}/api/DataGridStatesLookup`,
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
    });
  };

  const store1 = createStore();
  const store2 = createStore();

  const updateStores = function (events) {
    store1.push(events);
    store2.push(events);
  };

  createDataGrid('grid1', store1);
  createDataGrid('grid2', store2);

  const hubUrl = `${BASE_PATH}/dataGridCollaborativeEditingHub?GroupId=${groupId}`;
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
