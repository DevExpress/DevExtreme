const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope, $http, $q) => {
  let firstName = '';
  let lastName = '';
  const position = positions[0];
  let state = '';
  let currentClient = '';

  $scope.fullInfo = '';

  $scope.autocomplete = {
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
        version: 2,
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
          const params = {};
          [
            'skip',
            'take',
            'filter',
          ].forEach((option) => {
            if (option in loadOptions && isNotEmpty(loadOptions[option])) {
              params[option] = JSON.stringify(loadOptions[option]);
            }
          });
          return $http.get('https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup', { params })
            .then((response) => ({
              data: response.data.data,
            }), () => $q.reject('Data Loading Error'));
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
  };

  function updateEmployeeInfo() {
    let result = '';
    result += $.trim(`${firstName || ''} ${lastName || ''}`);
    result += (result && position) ? (`, ${position}`) : position || '';
    result += (result && state) ? (`, ${state}`) : state || '';
    result += (result && currentClient) ? (`, ${currentClient}`) : currentClient || '';

    $scope.fullInfo = result;
  }

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }
});
