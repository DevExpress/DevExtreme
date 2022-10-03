$(() => {
  let firstName = '';
  let lastName = '';
  const position = positions[0];
  let state = '';
  let currentClient = '';

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

  $('#current-client').dxAutocomplete({
    dataSource: new DevExpress.data.CustomStore({
      key: 'Value',
      useDefaultSearch: true,
      load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};

        [
          'skip',
          'take',
          'filter',
        ].forEach((option) => {
          if (option in loadOptions && isNotEmpty(loadOptions[option])) {
            args[option] = JSON.stringify(loadOptions[option]);
          }
        });

        $.ajax({
          url: 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup',
          dataType: 'json',
          data: args,
          success(result) {
            deferred.resolve(result.data);
          },
          error() {
            deferred.reject('Data Loading Error');
          },
          timeout: 5000,
        });

        return deferred.promise();
      },
    }),
    minSearchLength: 2,
    searchTimeout: 500,
    placeholder: 'Type client name...',
    valueExpr: 'Text',
    onValueChanged(data) {
      currentClient = data.value;
      updateEmployeeInfo();
    },
  });

  function updateEmployeeInfo() {
    let result = $.trim(`${firstName || ''} ${lastName || ''}`);

    result += (result && position) ? (`, ${position}`) : position || '';
    result += (result && state) ? (`, ${state}`) : state || '';
    result += (result && currentClient) ? (`, ${currentClient}`) : currentClient || '';

    $('#employee-data').text(result);
  }

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }
});
