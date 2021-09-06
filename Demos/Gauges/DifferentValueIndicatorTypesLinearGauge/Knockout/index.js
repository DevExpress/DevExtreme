window.onload = function () {
  const scale = {
    startValue: 0,
    endValue: 100,
    tickInterval: 50,
    label: {
      customizeText(arg) {
        return `${arg.valueText} %`;
      },
    },
  };

  const viewModel = {
    rectangleIndicator: {
      scale,
      value: 75,
      valueIndicator: {
        type: 'rectangle',
        color: '#9B870C',
      },
    },
    rhombusIndicator: {
      scale,
      value: 80,
      valueIndicator: {
        type: 'rhombus',
        color: '#779ECB',
      },
    },
    circleIndicator: {
      scale,
      value: 65,
      valueIndicator: {
        type: 'circle',
        color: '#8FBC8F',
      },
    },
    rangebarIndicator: {
      scale,
      value: 90,
      valueIndicator: {
        type: 'rangebar',
        color: '#483D8B',
      },
    },
    textCloudIndicator: {
      scale,
      value: 70,
      valueIndicator: {
        type: 'textCloud',
        color: '#734F96',
      },
    },
    triangleMarkerIndicator: {
      scale,
      value: 85,
      valueIndicator: {
        type: 'triangleMarker',
        color: '#f05b41',
      },
    },
  };

  ko.applyBindings(viewModel, $('#gauge-demo').get(0));
};
