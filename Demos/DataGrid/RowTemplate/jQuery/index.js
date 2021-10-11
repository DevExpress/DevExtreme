$(() => {
  const formatDate = new Intl.DateTimeFormat('en-US').format;

  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    dataRowTemplate(container, item) {
      const { data } = item;
      const markup = '<tr class=\'main-row\'>'
          + `<td rowspan='2'><img src='${data.Picture}' /></td>`
          + `<td>${data.Prefix}</td>`
          + `<td>${data.FirstName}</td>`
          + `<td>${data.LastName}</td>`
          + `<td>${data.Position}</td>`
          + `<td>${formatDate(new Date(data.BirthDate))}</td>`
          + `<td>${formatDate(new Date(data.HireDate))}</td>`
      + '</tr>'
      + '<tr class=\'notes-row\'>'
          + `<td colspan='6'><div>${data.Notes}</div></td>`
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
