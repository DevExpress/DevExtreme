$(() => {

  const columnChooserModes = [
    {
      key: 'select',
      name: 'Select Mode',
    },
    {
      key: 'dragAndDrop',
      name: 'Drag And Drop Mode',
    }
  ];

  const cardview = $("#cardview").dxCardView({
    dataSource: employees,
    keyExpr: "ID",
    width: "100%",
    paging: {
      pageSize: 8,
    },
    pager: {
      allowedPageSizes: [5, 8, 15, 30],
      showInfo: true,
      showNavigationButtons: true,
      showPageSizeSelector: true,
      visible: true,
    },
    columnChooser: {
      enabled: true,
      mode: columnChooserModes[0].key,
      position: {
        at: "center center",
      },
      width: 300,
      height: 400,
      search: {
        enabled: true,
      },
      selection: {
        allowSelectAll: true,
        recursive: true,
      },
    },
    cardCover: {
      imageExpr: (data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`,
      altExpr: "FirstName",
    },
    columns: [
      {
        caption: "Full Name",
        calculateCellValue: function (data) {
          return `${data.FirstName} ${data.LastName}`;
        },
      },
      {
        dataField: "Prefix",
        visible: false,
      },
      { dataField: "Position", showInColumnChooser: false },
      "BirthDate",
      {
        dataField: "HireDate",
        allowHiding: false,
      },
      "Address",
    ],
    cardsPerRow: 3,
  }).dxCardView('instance');

  $("#select-mode").dxSelectBox({
    items: columnChooserModes,
    value: columnChooserModes[0].key,
    inputAttr: { "aria-label": "Column Chooser Mode" },
    width: 250,
    valueExpr: 'key',
    displayExpr: 'name',
    onValueChanged(data) {
      cardview.option('columnChooser.mode', data.value);
      cardview.repaint();
    },
  });

  $('#searchEnabled').dxCheckBox({
    text: 'Search enabled',
    value: true,
    onValueChanged(data) {
      cardview.option('columnChooser.search.enabled', data.value);
    },
  });

  $('#allowSelectAll').dxCheckBox({
    text: 'Allow select all',
    value: true,
    onValueChanged(data) {
      cardview.option('columnChooser.selection.allowSelectAll', data.value);
    },
  });

  $('#selectByClick').dxCheckBox({
    text: 'Select by click',
    value: false,
    onValueChanged(data) {
      cardview.option('columnChooser.selection.selectByClick', data.value);
    },
  });

  $('#recursive').dxCheckBox({
    text: 'Recursive',
    value: true,
    onValueChanged(data) {
      dataGrid.option('columnChooser.selection.recursive', data.value);
    },
  });


});
