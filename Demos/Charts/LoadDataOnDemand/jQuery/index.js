$(() => {
  const HALFDAY = 43200000;
  let packetsLock = 0;

  $('#chart').dxChart({
    dataSource: new DevExpress.data.DataSource({
      store: [],
      sort: 'date',
      paginate: false,
    }),
    title: 'Temperature in Toronto (2017)',
    zoomAndPan: {
      argumentAxis: 'pan',
    },
    scrollBar: {
      visible: true,
    },
    argumentAxis: {
      argumentType: 'datetime',
      wholeRange: [new Date(2017, 0, 1), new Date(2017, 11, 31)],
      visualRange: {
        startValue: new Date(2017, 3, 1),
        length: {
          weeks: 2,
        },
      },
      visualRangeUpdateMode: 'keep',
    },
    valueAxis: {
      name: 'temperature',
      allowDecimals: false,
      title: {
        text: 'Temperature, °C',
        font: {
          color: '#ff950c',
        },
      },
      label: {
        font: {
          color: '#ff950c',
        },
      },
    },
    series: [{
      color: '#ff950c',
      type: 'rangeArea',
      argumentField: 'date',
      rangeValue1Field: 'minTemp',
      rangeValue2Field: 'maxTemp',
      name: 'Temperature range',
    }],
    onOptionChanged(e) {
      if (e.fullName === 'argumentAxis.visualRange') {
        onVisualRangeChanged(e.value, e.component);
      }
    },
    animation: {
      enabled: false,
    },
    loadingIndicator: {
      backgroundColor: 'none',
      font: {
        size: 14,
      },
    },
    legend: {
      visible: false,
    },
  });

  function onVisualRangeChanged(visualRange, component) {
    const items = component.getDataSource().items();
    if (!items.length
            || items[0].date - visualRange.startValue >= HALFDAY
            || visualRange.endValue - items[items.length - 1].date >= HALFDAY) {
      uploadDataByVisualRange(visualRange, component);
    }
  }

  function uploadDataByVisualRange(visualRange, component) {
    const dataSource = component.getDataSource();
    const storage = dataSource.items();
    const ajaxArgs = {
      startVisible: getDateString(visualRange.startValue),
      endVisible: getDateString(visualRange.endValue),
      startBound: getDateString(storage.length ? storage[0].date : null),
      endBound: getDateString(storage.length
        ? storage[storage.length - 1].date : null),
    };

    if (ajaxArgs.startVisible !== ajaxArgs.startBound
            && ajaxArgs.endVisible !== ajaxArgs.endBound && !packetsLock) {
      packetsLock += 1;
      component.showLoadingIndicator();
      getDataFrame(ajaxArgs)
        .then((dataFrame) => {
          packetsLock -= 1;

          const componentStorage = dataSource.store();
          dataFrame.forEach((item) => {
            componentStorage.insert(item);
          });
          dataSource.reload();

          const range = component.getArgumentAxis().visualRange();
          onVisualRangeChanged(range, component);
        },
        () => {
          packetsLock -= 1;
          dataSource.reload();
        });
    }
  }

  function getDataFrame(args) {
    const deferred = $.Deferred();
    $.ajax({
      url: 'https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData',
      dataType: 'json',
      data: args,
      success(result) {
        deferred.resolve(result.map((i) => ({
          date: new Date(i.Date),
          minTemp: i.MinTemp,
          maxTemp: i.MaxTemp,
        })));
      },
      error() {
        deferred.reject('Data Loading Error');
      },
      timeout: 2000,
    });

    return deferred.promise();
  }

  function getDateString(dateTime) {
    return dateTime ? dateTime.toLocaleDateString('en-US') : '';
  }
});
