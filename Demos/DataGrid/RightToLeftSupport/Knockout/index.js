window.onload = function () {
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
    headerCellTemplate: 'arabicTemplate',
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
    headerCellTemplate: 'englishTemplate',
  }, {
    dataField: 'accession',
    visible: false,
  }];
  const languages = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];

  const rtlEnabledValue = ko.observable(false);
  const columns = ko.observableArray(englishColumns);
  const searchPanelPlaceholder = ko.observable('Search...');

  const viewModel = {
    dataGridOptions: {
      dataSource: europeanUnion,
      rtlEnabled: rtlEnabledValue,
      showBorders: true,
      searchPanel: {
        visible: true,
        placeholder: searchPanelPlaceholder,
      },
      paging: {
        pageSize: 15,
      },
      columns,
    },
    selectLanguageOptions: {
      items: languages,
      value: languages[1],
      width: 250,
      onValueChanged(data) {
        const isRTL = data.value === languages[0];
        rtlEnabledValue(isRTL);
        columns((isRTL) ? arabicColumns : englishColumns);
        searchPanelPlaceholder((isRTL) ? 'بحث' : 'Search...');
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
