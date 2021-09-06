const DemoApp = angular.module('DemoApp', ['dx']);
const HALFDAY = 43200000;
let packetsLock = 0;

DemoApp.controller('DemoController', ($scope) => {
  let currentRange = {
    startValue: new Date(2017, 3, 1),
    length: {
      weeks: 2,
    },
  };

  Object.defineProperty($scope, 'currentRange', {
    get() {
      return currentRange;
    },

    set(newRange) {
      currentRange = newRange;
      onVisualRangeChanged();
    },
  });

  $scope.chartOptions = {
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
    bindingOptions: {
      'argumentAxis.visualRange': 'currentRange',
    },
    argumentAxis: {
      argumentType: 'datetime',
      wholeRange: [new Date(2017, 0, 1), new Date(2017, 11, 31)],
      visualRangeUpdateMode: 'keep',
    },
    valueAxis: {
      name: 'temperature',
      allowDecimals: false,
      title: {
        text: 'Temperature, &deg;C',
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
  };

  function onVisualRangeChanged() {
    const component = $('#chart').dxChart('instance');
    const items = component.getDataSource().items();
    const visualRange = $scope.currentRange;
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
      packetsLock++;
      component.showLoadingIndicator();
      getDataFrame(ajaxArgs)
        .then((dataFrame) => {
          packetsLock--;

          const componentStorage = dataSource.store();
          dataFrame.forEach((item) => {
            componentStorage.insert(item);
          });
          dataSource.reload();

          onVisualRangeChanged();
        },
        () => {
          packetsLock--;
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
