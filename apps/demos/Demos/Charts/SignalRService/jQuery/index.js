$(() => {
  $.connection.hub.url = 'https://js.devexpress.com/Demos/Mvc/signalr';
  const hub = $.connection.stockTickDataHub;

  const store = new DevExpress.data.CustomStore({
    load() {
      return hub.server.getAllData();
    },
    key: 'Date',
  });

  hub.client.updateStockPrice = function (data) {
    store.push([{ type: 'insert', key: data.Date, data }]);
  };

  $.connection.hub.start({ waitForPageLoad: false }).done(() => {
    $('#chart').dxChart({
      dataSource: store,
      margin: {
        right: 30,
      },
      loadingIndicator: {
        enabled: true,
      },
      title: 'Stock Price',
      series: [{
        pane: 'Price',
        argumentField: 'Date',
        type: 'candlestick',
        aggregation: {
          enabled: true,
          method: 'custom',
          calculate(e) {
            const prices = e.data.map((i) => i.Price);
            if (prices.length) {
              return {
                Date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
                open: prices[0],
                high: Math.max.apply(null, prices),
                low: Math.min.apply(null, prices),
                close: prices[prices.length - 1],
              };
            }
            return null;
          },
        },
      }, {
        pane: 'Volume',
        name: 'Volume',
        argumentField: 'Date',
        type: 'bar',
        valueField: 'Volume',
        color: 'red',
        aggregation: {
          enabled: true,
          method: 'sum',
        },
      }],
      panes: [{
        name: 'Price',
      }, {
        name: 'Volume',
        height: 80,
      }],
      customizePoint(arg) {
        if (arg.seriesName === 'Volume') {
          const point = $('#chart').dxChart('getAllSeries')[0].getPointsByArg(arg.argument)[0].data;
          if (point.close >= point.open) {
            return { color: '#1db2f5' };
          }
        }
        return null;
      },
      tooltip: {
        enabled: true,
        shared: true,
        argumentFormat: 'shortDateShortTime',
        contentTemplate(pointInfo, element) {
          const print = function (label, value) {
            const span = $('<span>', {
              class: 'tooltip-label',
              text: label,
            });
            element.append($('<div>', {
              text: value,
            }).prepend(span));
          };

          const volume = pointInfo.points.filter((point) => point.seriesName === 'Volume')[0];
          const prices = pointInfo.points.filter((point) => point.seriesName !== 'Volume')[0];

          print('', pointInfo.argumentText);
          print('Open: ', formatCurrency(prices.openValue));
          print('High: ', formatCurrency(prices.highValue));
          print('Low: ', formatCurrency(prices.lowValue));
          print('Close: ', formatCurrency(prices.closeValue));
          print('Volume: ', formatNumber(volume.value));
        },
      },
      crosshair: {
        enabled: true,
        horizontalLine: { visible: false },
      },
      zoomAndPan: {
        argumentAxis: 'both',
      },
      scrollBar: {
        visible: true,
      },
      legend: {
        visible: false,
      },
      argumentAxis: {
        argumentType: 'datetime',
        minVisualRangeLength: { minutes: 10 },
        visualRange: {
          length: 'hour',
        },
      },
      valueAxis: {
        placeholderSize: 50,
      },
    });
  });

  const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format;
  const formatNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format;
});
