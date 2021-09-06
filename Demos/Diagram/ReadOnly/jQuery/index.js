$(() => {
  const diagram = $('#diagram').dxDiagram({
    readOnly: true,
  }).dxDiagram('instance');

  $.ajax({
    url: '../../../../data/diagram-structure.json',
    dataType: 'text',
    success(data) {
      diagram.import(data);
    },
  });
});
