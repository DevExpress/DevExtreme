$(() => {
  let firstName = '';
  let lastName = '';
  const position = positions[0];
  let city = '';
  let state = '';

  $('#first-name').dxAutocomplete({
    dataSource: names,
    placeholder: 'Type first name...',
    onValueChanged(data) {
      firstName = data.value;
      updateEmployeeInfo();
    },
  });

  $('#last-name').dxAutocomplete({
    dataSource: surnames,
    placeholder: 'Type last name...',
    showClearButton: true,
    onValueChanged(data) {
      lastName = data.value;
      updateEmployeeInfo();
    },
  });

  $('#position').dxAutocomplete({
    dataSource: positions,
    value: position,
    disabled: true,
  });

  $('#city').dxAutocomplete({
    dataSource: cities,
    minSearchLength: 2,
    searchTimeout: 500,
    placeholder: 'Type two symbols to search...',
    onValueChanged(data) {
      city = data.value;
      updateEmployeeInfo();
    },
  });

  $('#state').dxAutocomplete({
    dataSource: new DevExpress.data.ODataStore({
      url: 'https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short',
      key: 'Sate_ID',
      keyType: 'Int32',
    }),
    placeholder: 'Type state name...',
    valueExpr: 'State_Long',
    itemTemplate(data) {
      return $(`<div>${data.State_Long} (${data.State_Short})</div>`);
    },
    onValueChanged(data) {
      state = data.value;
      updateEmployeeInfo();
    },
  });

  function updateEmployeeInfo() {
    let result = $.trim(`${firstName || ''} ${lastName || ''}`);

    result += (result && position) ? (`, ${position}`) : position;
    result += (result && city) ? (`, ${city}`) : city;
    result += (result && state) ? (`, ${state}`) : state;

    $('#employee-data').text(result);
  }
});
