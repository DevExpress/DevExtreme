$(() => {
  const formatDate = new Intl.DateTimeFormat('en-US').format;

  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    dataRowTemplate(container, item) {
      const { data } = item;
      const markup = '<tr class=\'main-row\' role=\'row\'>'
          + `<td rowspan='2' role="gridcell"><img src='${data.Picture}' alt='Picture of ${data.FirstName} ${data.LastName}' tabindex='0'/></td>`
          + `<td role='gridcell'>${data.Prefix}</td>`
          + `<td role='gridcell'>${data.FirstName}</td>`
          + `<td role='gridcell'>${data.LastName}</td>`
          + `<td role='gridcell'>${data.Position}</td>`
          + `<td role='gridcell'>${formatDate(new Date(data.BirthDate))}</td>`
          + `<td role='gridcell'>${formatDate(new Date(data.HireDate))}</td>`
      + '</tr>'
      + '<tr class=\'notes-row\' role=\'row\'>'
          + `<td colspan='6' role='gridcell'><div>${data.Notes}</div></td>`
      + '</tr>';

      container.append(markup);
    },
    rowAlternationEnabled: true,
    hoverStateEnabled: true,
    columnAutoWidth: true,
    showBorders: true,
    columns: [{
      caption: 'Photo',
      width: 100,
      allowFiltering: false,
      allowSorting: false,
    }, {
      dataField: 'Prefix',
      caption: 'Title',
      width: 70,
    },
    'FirstName',
    'LastName',
    'Position', {
      dataField: 'BirthDate',
      dataType: 'date',
    }, {
      dataField: 'HireDate',
      dataType: 'date',
    },
    ],
  });
});
