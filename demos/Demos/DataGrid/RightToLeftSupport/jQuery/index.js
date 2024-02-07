$(() => {
  const arabicColumns = [{
    dataField: 'nameAr',
    caption: 'الدولة',
  }, {
    dataField: 'capitalAr',
    caption: 'عاصمة',
  }, {
    dataField: 'population',
    format: {
      type: 'fixedPoint',
      precision: 0,
    },
    caption: 'عدد السكان (نسمة) 2013',
  }, {
    dataField: 'area',
    format: {
      type: 'fixedPoint',
      precision: 0,
    },
    headerCellTemplate(container) {
      container.append($('<div>المساحة (كم<sup>2</sup>)</div>'));
    },
  }, {
    dataField: 'accession',
    visible: false,
  }];
  const englishColumns = [{
    dataField: 'nameEn',
    caption: 'Name',
  }, {
    dataField: 'capitalEn',
    caption: 'Capital',
  }, {
    dataField: 'population',
    format: {
      type: 'fixedPoint',
      precision: 0,
    },
  }, {
    dataField: 'area',
    format: {
      type: 'fixedPoint',
      precision: 0,
    },
    headerCellTemplate(container) {
      container.append($('<div>Area (km<sup>2</sup>)</div>'));
    },
  }, {
    dataField: 'accession',
    visible: false,
  }];

  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: europeanUnion,
    keyExpr: 'nameEn',
    showBorders: true,
    searchPanel: {
      visible: true,
    },
    paging: {
      pageSize: 15,
    },
    columns: englishColumns,
  }).dxDataGrid('instance');

  const languages = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];

  $('#select-language').dxSelectBox({
    items: languages,
    value: languages[1],
    inputAttr: { 'aria-label': 'Language' },
    width: 250,
    onValueChanged(data) {
      const isRTL = data.value === languages[0];
      dataGrid.option('rtlEnabled', isRTL);
      dataGrid.option('columns', (isRTL) ? arabicColumns : englishColumns);
      dataGrid.option('searchPanel.placeholder', (isRTL) ? 'بحث' : 'Search...');
    },
  });
});
