window.onload = function () {
  let firstName = '';
  let lastName = '';
  const position = positions[0];
  let state = '';
  let currentClient = '';

  const viewModel = {
    defaultMode: {
      dataSource: names,
      placeholder: 'Type first name...',
      onValueChanged(data) {
        firstName = data.value;
        updateEmployeeInfo();
      },
    },
    withClearButton: {
      dataSource: surnames,
      placeholder: 'Type last name...',
      showClearButton: true,
      onValueChanged(data) {
        lastName = data.value;
        updateEmployeeInfo();
      },
    },
    disabled: {
      dataSource: positions,
      value: position,
      disabled: true,
    },
    customItemTemplate: {
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
    },
    customStoreUsage: {
      dataSource: new DevExpress.data.CustomStore({
        key: 'Value',
        useDefaultSearch: true,
        load(loadOptions) {
          const deferred = $.Deferred();
          let params = '?';
          [
            'skip',
            'take',
            'filter',
          ].forEach((option) => {
            if (option in loadOptions && isNotEmpty(loadOptions[option])) {
              params += `${option}=${JSON.stringify(loadOptions[option])}&`;
            }
          });
          params = params.slice(0, -1);

          const xhr = new XMLHttpRequest();
          xhr.open('GET', `https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup${params}`, true);

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                deferred.resolve(result.data);
              } else {
                deferred.reject('Data Loading Error');
              }
            }
          };
          xhr.send();

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
    },
    fullInfo: ko.observable(''),

  };

  function updateEmployeeInfo() {
    let result = '';
    result += $.trim(`${firstName || ''} ${lastName || ''}`);
    result += (result && position) ? (`, ${position}`) : position || '';
    result += (result && state) ? (`, ${state}`) : state || '';
    result += (result && currentClient) ? (`, ${currentClient}`) : currentClient || '';

    viewModel.fullInfo(result);
  }

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }

  ko.applyBindings(viewModel, document.getElementById('autocomplete-demo'));
};
