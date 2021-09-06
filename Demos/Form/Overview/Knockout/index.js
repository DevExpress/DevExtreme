window.onload = function () {
  const showColon = ko.observable(true);
  const formData = ko.observable(companies[0]);
  const readOnly = ko.observable(false);
  const labelLocation = ko.observable('top');
  const minColWidth = ko.observable(300);
  const colCount = ko.observable(2);
  const widthValue = ko.observable(undefined);

  const viewModel = {
    formOptions: {
      formData,
      readOnly,
      showColonAfterLabel: showColon,
      labelLocation,
      minColWidth,
      colCount,
      width: widthValue,
    },
    selectCompanyOptions: {
      displayExpr: 'Name',
      dataSource: companies,
      value: formData,
    },
    readOnlyOptions: {
      value: readOnly,
      text: 'readOnly',
    },
    showColonOptions: {
      value: showColon,
      text: 'showColonAfterLabel',
    },
    labelLocationOptions: {
      items: ['left', 'top'],
      value: labelLocation,
    },
    minColWidthOptions: {
      items: [150, 200, 300],
      value: minColWidth,
    },
    colCountOptions: {
      items: ['auto', 1, 2, 3],
      value: colCount,
    },
    widthOptions: {
      max: 550,
      value: widthValue,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('form-demo'));
};
