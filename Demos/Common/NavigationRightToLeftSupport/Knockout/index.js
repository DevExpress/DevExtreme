window.onload = function () {
  const languages = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  const rtlEnabled = ko.observable(false);

  const accordionTemplate = ko.computed(() => (rtlEnabled() ? 'arabic' : 'english'));

  const accordionTitleTemplate = ko.computed(() => (rtlEnabled() ? 'arabicTitle' : 'englishTitle'));

  const displayExpr = ko.computed(() => (rtlEnabled() ? 'textAr' : 'text'));

  const viewModel = {
    rtlEnabled,
    treeViewOptions: {
      dataSource: continents,
      width: 200,
      displayExpr,
      rtlEnabled,
    },
    menuOptions: {
      dataSource: continents,
      rtlEnabled,
      displayExpr,
    },
    accordionOptions: {
      dataSource: europeCountries,
      itemTitleTemplate: accordionTitleTemplate,
      itemTemplate: accordionTemplate,
      rtlEnabled,
    },
    selectBoxOptions: {
      items: languages,
      value: languages[1],
      onValueChanged(data) {
        rtlEnabled(data.value === languages[0]);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('rtl'));
};
