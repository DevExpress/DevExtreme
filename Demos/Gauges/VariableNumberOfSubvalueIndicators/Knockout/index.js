window.onload = function () {
  const gaugeValue = ko.observable(dataSource[0].primary);
  const gaugeSubvalues = ko.observable(dataSource[0].secondary);

  const viewModel = {
    linearGaugeOptions: {
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
      value: gaugeValue,
      subvalues: gaugeSubvalues,
    },
    selectBoxOptions: {
      dataSource,
      displayExpr: 'name',
      onValueChanged(e) {
        const { value } = e;

        gaugeValue(value.primary);
        gaugeSubvalues(value.secondary);
      },
      value: dataSource[0],
      width: 200,
    },
  };

  ko.applyBindings(viewModel, $('#gauge-demo').get(0));
};
