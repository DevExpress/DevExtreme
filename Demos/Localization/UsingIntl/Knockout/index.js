window.onload = function () {
  const locale = getLocale();
  const locales = [
    { name: 'English', value: 'en' },
    { name: 'Deutsch', value: 'de' },
    { name: 'Русский', value: 'ru' },
  ];

  const viewModel = {
    dataGridOptions: {
      dataSource: payments,
      columns: [{
        dataField: 'PaymentId',
        allowEditing: false,
        width: '100px',
      }, {
        dataField: 'ContactName',
      }, {
        dataField: 'CompanyName',
      }, {
        dataField: 'Amount',
        dataType: 'number',
        format: { type: 'currency' },
      }, {
        dataField: 'PaymentDate',
        dataType: 'date',
      }],
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      editing: {
        mode: 'popup',
        allowUpdating: true,
        popup: {
          width: 700,
          height: 345,
        },
      },
    },

    selectBoxOptions: {
      inputAttr: { id: 'selectInput' },
      dataSource: locales,
      displayExpr: 'name',
      valueExpr: 'value',
      value: locale,
      onValueChanged: changeLocale,
    },
  };

  function changeLocale(data) {
    setLocale(data.value);
    document.location.reload();
  }

  function getLocale() {
    const storageLocale = sessionStorage.getItem('locale');
    return storageLocale != null ? storageLocale : 'en';
  }

  function setLocale(savingLocale) {
    sessionStorage.setItem('locale', savingLocale);
  }

  DevExpress.localization.locale(locale);
  ko.applyBindings(viewModel, $('#demo-container')[0]);
};
