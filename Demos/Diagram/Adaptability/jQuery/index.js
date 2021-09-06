$(() => {
  const diagram = $('#diagram').dxDiagram({
    autoZoomMode: 'fitWidth',
  }).dxDiagram('instance');

  $.ajax({
    url: '../../../../data/diagram-flow.json',
    dataType: 'text',
    success(data) {
      diagram.import(data);
    },
  });
});
