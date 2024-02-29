$(() => {
  const chart = $('#chart').dxChart({
    dataSource,
    title: 'Weather in Las Vegas, NV (2017)',
    commonSeriesSettings: {
      argumentField: 'date',
    },
    argumentAxis: {
      argumentType: 'datetime',
      aggregationInterval: 'week',
      valueMarginsEnabled: false,
    },
    valueAxis: [{
      name: 'temperature',
      title: {
        text: 'Temperature, °C',
        font: {
          color: '#e91e63',
        },
      },
      label: {
        font: {
          color: '#e91e63',
        },
      },
    }, {
      name: 'precipitation',
      position: 'right',
      title: {
        text: 'Precipitation, mm',
        font: {
          color: '#03a9f4',
        },
      },
      label: {
        font: {
          color: '#03a9f4',
        },
      },
    },
    ],
    legend: {
      visible: false,
    },
    series: [{
      axis: 'precipitation',
      color: '#03a9f4',
      type: 'bar',
      valueField: 'precip',
      name: 'Precipitation',
    }, {
      axis: 'temperature',
      color: '#ffc0bb',
      type: 'rangeArea',
      rangeValue1Field: 'minTemp',
      rangeValue2Field: 'maxTemp',
      aggregation: {
        enabled: true,
        method: 'custom',
        calculate(aggregationInfo) {
          if (!aggregationInfo.data.length) {
            return null;
          }
          const temp = aggregationInfo.data.map((item) => item.temp);
          const maxTemp = Math.max.apply(null, temp);
          const minTemp = Math.min.apply(null, temp);

          return {
            date: new Date((aggregationInfo.intervalStart.valueOf()
              + aggregationInfo.intervalEnd.valueOf()) / 2),
            maxTemp,
            minTemp,
          };
        },
      },
      name: 'Temperature range',
    }, {
      axis: 'temperature',
      color: '#e91e63',
      valueField: 'temp',
      point: {
        size: 7,
      },
      aggregation: {
        enabled: true,
      },
      name: 'Average temperature',
    }],
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        return customTooltipHandlers[arg.seriesName](arg, arg.point.aggregationInfo);
      },
    },
  }).dxChart('instance');

  $('#useAggregationToggle').dxCheckBox({
    text: 'Aggregation enabled',
    value: true,
    onValueChanged(data) {
      chart.option('series[1].aggregation.enabled', data.value);
      chart.option('series[2].aggregation.enabled', data.value);
    },
  });

  $('#aggregateIntervalSelector').dxSelectBox({
    items: intervals,
    value: 'week',
    valueExpr: 'interval',
    inputAttr: { 'aria-label': 'Interval' },
    displayExpr: 'displayName',
    onValueChanged(data) {
      chart.option('argumentAxis.aggregationInterval', data.value);
    },
  });

  $('#aggregateFunctionSelector').dxSelectBox({
    items: functions,
    value: 'avg',
    valueExpr: 'func',
    inputAttr: { 'aria-label': 'Function' },
    displayExpr: 'displayName',
    onValueChanged(data) {
      chart.option('series[2].aggregation.method', data.value);
    },
  });

  const customTooltipHandlers = {
    'Average temperature': function (arg, aggregationInfo) {
      const start = aggregationInfo && aggregationInfo.intervalStart;
      const end = aggregationInfo && aggregationInfo.intervalEnd;

      return {
        text: `${!aggregationInfo
          ? `Date: ${arg.argument.toDateString()}`
          : `Interval: ${start.toDateString()
          } - ${end.toDateString()}`
        }<br/>Temperature: ${arg.value.toFixed(2)} °C`,
      };
    },
    'Temperature range': function (arg, aggregationInfo) {
      const start = aggregationInfo.intervalStart;
      const end = aggregationInfo.intervalEnd;

      return {
        text: `Interval: ${start.toDateString()
        } - ${end.toDateString()
        }<br/>Temperature range: ${arg.rangeValue1
        } - ${arg.rangeValue2} °C`,
      };
    },
    Precipitation(arg) {
      return {
        text: `Date: ${arg.argument.toDateString()
        }<br/>Precipitation: ${arg.valueText} mm`,
      };
    },
  };
});
