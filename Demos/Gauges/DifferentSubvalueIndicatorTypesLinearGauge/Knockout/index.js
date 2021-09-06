window.onload = function () {
  const scale = {
    startValue: 10,
    endValue: 50,
    tickInterval: 10,
    label: {
      customizeText(arg) {
        return `$${arg.valueText}`;
      },
    },
  };

  const viewModel = {
    rectangleIndicator: {
      scale,
      value: 24,
      subvalues: [18, 43],
      subvalueIndicator: {
        type: 'rectangle',
        color: '#9B870C',
      },
    },
    rhombusIndicator: {
      scale,
      value: 38,
      subvalues: [18, 43],
      subvalueIndicator: {
        type: 'rhombus',
        color: '#779ECB',
      },
    },
    circleIndicator: {
      scale,
      value: 21,
      subvalues: [18, 43],
      subvalueIndicator: {
        type: 'circle',
        color: '#8FBC8F',
      },
    },
    textCloudIndicator: {
      scale,
      value: 42,
      subvalues: [18, 43],
      subvalueIndicator: {
        type: 'textCloud',
        color: '#734F96',
      },
    },
    triangleMarkerIndicator: {
      scale,
      value: 28,
      subvalues: [18, 43],
      subvalueIndicator: {
        type: 'triangleMarker',
        color: '#f05b41',
      },
    },
  };

  ko.applyBindings(viewModel, $('#gauge-demo').get(0));
};
