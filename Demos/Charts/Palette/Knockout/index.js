window.onload = function () {
  const palette = ko.observable(paletteCollection[0]);
  const paletteExtensionMode = ko.observable('Blend');
  const viewModel = {
    chartOptions: {
      palette,
      dataSource,
      series: {},
      paletteExtensionMode,
      legend: {
        visible: false,
      },
    },

    paletteSelectBoxOptions: {
      items: paletteCollection,
      value: palette,
    },

    extensionModeSelectBoxOptions: {
      items: paletteExtensionModes,
      value: paletteExtensionMode,
    },

    baseColors: ko.computed(() => DevExpress.viz.getPalette(palette()).simpleSet),
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
