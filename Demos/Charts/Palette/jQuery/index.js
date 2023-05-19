$(() => {
  $('#pie').dxPieChart({
    palette: paletteCollection[0],
    dataSource,
    series: {},
    legend: {
      visible: false,
    },
    onDrawn(e) {
      const paletteName = e.component.option('palette');
      const palette = DevExpress.viz.getPalette(paletteName).simpleSet;
      const paletteContainer = $('.palette-container');

      paletteContainer.html('');

      palette.forEach((color) => {
        $('<div>').css({
          backgroundColor: color,
        })
          .addClass('palette-item')
          .appendTo(paletteContainer);
      });
    },
  });

  $('#palette').dxSelectBox({
    items: paletteCollection,
    value: paletteCollection[0],
    inputAttr: { 'aria-label': 'Palette' },
    onValueChanged(e) {
      $('#pie').dxPieChart({
        palette: e.value,
      });
    },
  });

  $('#extension-mode').dxSelectBox({
    items: paletteExtensionModes,
    value: 'Blend',
    inputAttr: { 'aria-label': 'Palette Extension Mode' },
    onValueChanged(e) {
      $('#pie').dxPieChart({
        paletteExtensionMode: e.value,
      });
    },
  });
});
