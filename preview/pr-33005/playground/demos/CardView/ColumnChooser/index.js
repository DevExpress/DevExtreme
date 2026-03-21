$(() => {
  const cardView = $('#card-view').dxCardView({
    dataSource: employees,
    keyExpr: 'ID',
    cardsPerRow: 'auto',
    cardMinWidth: 300,
    columnChooser: {
      enabled: true,
      mode: 'select',
      height: '340px',
      search: {
        enabled: true,
      },
      selection: {
        allowSelectAll: true,
        selectByClick: true,
      },
    },
    searchPanel: {
      visible: true,
    },
    cardCover: {
      imageExpr: ({ First_Name, Last_Name }) => `../../../images/employees/new/${First_Name} ${Last_Name}.jpg`,
      altExpr: ({ First_Name, Last_Name }) => `Photo of ${First_Name} ${Last_Name}`,
    },
    columns: [
      {
        caption: 'Full Name',
        calculateFieldValue(data) {
          return `${data.First_Name} ${data.Last_Name}`;
        },
        allowHiding: false,
      },
      {
        dataField: 'Birth_Date',
        dataType: 'date',
      },
      {
        dataField: 'Hire_Date',
        dataType: 'date',
      },
      'Position',
      'Department',
      'State',
      'City',
      {
        dataField: 'Phone',
        allowHiding: false,
      },
      {
        dataField: 'Email',
        visible: false,
      },
    ],
  }).dxCardView('instance');

  function renderOptions() {
    $('#column-chooser-mode').dxSelectBox({
      dataSource: ['dragAndDrop', 'select'],
      value: cardView.option('columnChooser.mode'),
      onValueChanged: ({ value }) => {
        cardView.option('columnChooser.mode', value);
        renderOptions();
      },
      inputAttr: {
        'aria-label': 'Column Chooser Mode',
      },
    });

    $('#search-enabled').dxCheckBox({
      text: 'Search Enabled',
      value: cardView.option('columnChooser.search.enabled') ?? false,
      onValueChanged: ({ value }) => {
        cardView.option('columnChooser.search.enabled', value);
      },
    });

    $('#allow-select-all').dxCheckBox({
      text: 'Allow Select All',
      value: cardView.option('columnChooser.selection.allowSelectAll') ?? false,
      onValueChanged: ({ value }) => {
        cardView.option('columnChooser.selection.allowSelectAll', value);
      },
      disabled: cardView.option('columnChooser.mode') !== 'select',
    });

    $('#select-by-click').dxCheckBox({
      text: 'Select By Click On Item',
      value: cardView.option('columnChooser.selection.selectByClick') ?? false,
      onValueChanged: ({ value }) => {
        cardView.option('columnChooser.selection.selectByClick', value);
      },
      disabled: cardView.option('columnChooser.mode') !== 'select',
    });

    $('#allow-column-reordering').dxCheckBox({
      text: 'Allow Column Reordering',
      value: cardView.option('allowColumnReordering') ?? false,
      onValueChanged: ({ value }) => {
        cardView.option('allowColumnReordering', value);
      },
    });
  }

  renderOptions();
});
