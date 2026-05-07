$(() => {
  $.type = $.type || function (obj) {
    if (obj == null) {
      return obj + '';
    }

    return typeof obj;
  };

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  const store = new DevExpress.data.CustomStore({
    load() {
      return connection.invoke("getAllStocks");
    },
    key: 'symbol',
  });

  connection.on("updateStockPrice", (data) => {
    store.push([{ type: 'update', key: data.symbol, data }]);
  });

  connection.start().then(() => {
    $('#gridContainer').dxDataGrid({
      dataSource: store,
      showBorders: true,
      repaintChangesOnly: true,
      highlightChanges: true,
      columns: [{
        dataField: 'lastUpdate',
        dataType: 'date',
        width: 115,
        format: 'longTime',
      }, {
        dataField: 'symbol',
      }, {
        dataField: 'price',
        dataType: 'number',
        format: '#0.####',
        cellTemplate(container, options) {
          const wrapper = $('<div>')
            .addClass((options.data.change > 0) ? 'inc' : 'dec')
            .text(options.text);
          wrapper.appendTo(container);
        },
      }, {
        dataField: 'change',
        dataType: 'number',
        width: 140,
        format: '#0.####',
        cellTemplate(container, options) {
          const fieldData = options.data;
          const wrapper = $('<div>')
            .addClass(fieldData.change > 0 ? 'inc' : 'dec');

          $('<span>')
            .addClass('current-value')
            .text(options.text)
            .appendTo(wrapper);

          $('<span>')
            .addClass('arrow')
            .appendTo(wrapper);

          $('<span>')
            .addClass('diff')
            .text(`${fieldData.percentChange.toFixed(2)}%`)
            .appendTo(wrapper);

          wrapper.appendTo(container);
        },
      }, {
        dataField: 'dayOpen',
        dataType: 'number',
        format: '#0.####',
      }, {
        dataField: 'dayMin',
        dataType: 'number',
        format: '#0.####',
      }, {
        dataField: 'dayMax',
        dataType: 'number',
        format: '#0.####',
      }],
    });
  });
});
