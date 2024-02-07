$(() => {
  const gauge = $('#gauge').dxLinearGauge({
    scale: {
      startValue: 0,
      endValue: 10,
      tickInterval: 2,
      label: {
        customizeText(arg) {
          return `${arg.valueText} kW`;
        },
      },
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        let result = `${arg.valueText} kW`;
        if (arg.index >= 0) {
          result = `Secondary ${arg.index + 1}: ${result}`;
        } else {
          result = `Primary: ${result}`;
        }
        return {
          text: result,
        };
      },
    },
    export: {
      enabled: true,
    },
    title: {
      text: 'Power of Air Conditioners in Store Departments (kW)',
      font: { size: 28 },
    },
    value: dataSource[0].primary,
    subvalues: dataSource[0].secondary,
  }).dxLinearGauge('instance');

  $('#selectbox').dxSelectBox({
    dataSource,
    inputAttr: { 'aria-label': 'Department' },
    displayExpr: 'name',
    onValueChanged(data) {
      gauge.value(data.value.primary);
      gauge.subvalues(data.value.secondary);
    },
    value: dataSource[0],
    width: 200,
  });
});
