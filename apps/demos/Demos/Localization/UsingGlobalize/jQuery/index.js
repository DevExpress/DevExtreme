$(() => {
  const dictionary = {
    en: {
      Number: 'Number',
      Contact: 'Contact',
      Company: 'Company',
      Amount: 'Amount',
      PaymentDate: 'Payment Date',
    },
    de: {
      Number: 'Nummer',
      Contact: 'Ansprechpartner',
      Company: 'Firma',
      Amount: 'Betrag',
      PaymentDate: 'Zahlungsdatum',
    },
    ru: {
      Number: 'Номер',
      Contact: 'Имя',
      Company: 'Организация',
      Amount: 'Сумма',
      PaymentDate: 'Дата оплаты',
    },
  };
  Globalize.loadMessages(dictionary);

  const locale = getLocale();
  Globalize.locale(locale);

  const locales = [
    { name: 'English', value: 'en' },
    { name: 'Deutsch', value: 'de' },
    { name: 'Русский', value: 'ru' },
  ];

  const dataGridOptions = {
    dataSource: payments,
    columns: [{
      dataField: 'PaymentId',
      caption: Globalize.formatMessage('Number'),
      allowEditing: false,
      width: '100px',
    }, {
      dataField: 'ContactName',
      caption: Globalize.formatMessage('Contact'),
    }, {
      dataField: 'CompanyName',
      caption: Globalize.formatMessage('Company'),
    }, {
      dataField: 'Amount',
      caption: Globalize.formatMessage('Amount'),
      dataType: 'number',
      format: 'currency',
      editorOptions: {
        format: 'currency',
        showClearButton: true,
      },
    }, {
      dataField: 'PaymentDate',
      caption: Globalize.formatMessage('PaymentDate'),
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
  };

  const selectBoxOptions = {
    inputAttr: { id: 'selectInput' },
    dataSource: locales,
    displayExpr: 'name',
    valueExpr: 'value',
    value: locale,
    onValueChanged: changeLocale,
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

  $('#gridContainer').dxDataGrid(dataGridOptions);
  $('#selectBox').dxSelectBox(selectBoxOptions);
});
