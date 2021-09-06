window.onload = function () {
  const geometry = {
    startAngle: 180,
    endAngle: 0,
  };
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
    rectangleNeedleIndicator: {
      geometry,
      scale,
      value: 75,
      valueIndicator: {
        type: 'rectangleNeedle',
        color: '#9B870C',
      },
    },
    twoColorNeedleIndicator: {
      geometry,
      scale,
      value: 80,
      valueIndicator: {
        type: 'twoColorNeedle',
        color: '#779ECB',
        secondColor: '#734F96',
      },
    },
    triangleNeedleIndicator: {
      geometry,
      scale,
      value: 65,
      valueIndicator: {
        type: 'triangleNeedle',
        color: '#8FBC8F',
      },
    },
    rangebarIndicator: {
      geometry,
      scale,
      value: 90,
      valueIndicator: {
        type: 'rangebar',
        color: '#f05b41',
      },
    },
    textCloudIndicator: {
      geometry,
      scale,
      value: 70,
      valueIndicator: {
        type: 'textCloud',
        color: '#483D8B',
      },
    },
    triangleMarkerIndicator: {
      geometry,
      scale,
      value: 85,
      valueIndicator: {
        type: 'triangleMarker',
        color: '#e0e33b',
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('gauge-demo'));
};
