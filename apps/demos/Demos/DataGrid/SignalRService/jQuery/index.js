$(() => {
  $.connection.hub.url = 'https://js.devexpress.com/Demos/Mvc/signalr';
  const hub = $.connection.liveUpdateSignalRHub;
  const store = new DevExpress.data.CustomStore({
    load() {
      return hub.server.getAllStocks();
    },
    key: 'Symbol',
  });

  hub.client.updateStockPrice = function (data) {
    store.push([{ type: 'update', key: data.Symbol, data }]);
  };

  $.connection.hub.start({ waitForPageLoad: false }).done(() => {
    $('#gridContainer').dxDataGrid({
      dataSource: store,
      showBorders: true,
      repaintChangesOnly: true,
      highlightChanges: true,
      columns: [{
        dataField: 'LastUpdate',
        dataType: 'date',
        width: 115,
        format: 'longTime',
      }, {
        dataField: 'Symbol',
      }, {
        dataField: 'Price',
        dataType: 'number',
        format: '#0.####',
        cellTemplate(container, options) {
          container.addClass((options.data.Change > 0) ? 'inc' : 'dec');
          container.html(options.text);
        },
      }, {
        dataField: 'Change',
        dataType: 'number',
        width: 140,
        format: '#0.####',
        cellTemplate(container, options) {
          const fieldData = options.data;
          container.addClass(fieldData.Change > 0 ? 'inc' : 'dec');

          $('<span>')
            .addClass('current-value')
            .text(options.text)
            .appendTo(container);

          $('<span>')
            .addClass('arrow')
            .appendTo(container);

          $('<span>')
            .addClass('diff')
            .text(`${fieldData.PercentChange.toFixed(2)}%`)
            .appendTo(container);
        },
      }, {
        dataField: 'DayOpen',
        dataType: 'number',
        format: '#0.####',
      }, {
        dataField: 'DayMin',
        dataType: 'number',
        format: '#0.####',
      }, {
        dataField: 'DayMax',
        dataType: 'number',
        format: '#0.####',
      }],
    });
  });
});
