$(() => {
  const diagram = $('#diagram').dxDiagram({
    customShapes: employees.map(
      (emp) => ({
        category: 'employees',
        type: `employee${emp.ID}`,
        baseType: 'rectangle',
        defaultText: emp.Full_Name,
        allowEditText: false,
      }),
    ),
    toolbox: {
      groups: [{ category: 'employees', title: 'Employees', displayMode: 'texts' }],
    },
  }).dxDiagram('instance');

  $.ajax({
    url: '../../../../data/diagram-employees.json',
    dataType: 'text',
    success(data) {
      diagram.import(data);
    },
  });
});
