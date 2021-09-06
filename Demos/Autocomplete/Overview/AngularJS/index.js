const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let firstName = '';
  let lastName = '';
  const position = positions[0];
  let city = '';
  let state = '';

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
    customSearchOptions: {
      dataSource: cities,
      minSearchLength: 2,
      searchTimeout: 500,
      placeholder: 'Type two symbols to search...',
      onValueChanged(data) {
        city = data.value;
        updateEmployeeInfo();
      },
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
        return $(`<div>${data.State_Long
        } (${data.State_Short})` + '</div>');
      },
      onValueChanged(data) {
        state = data.value;
        updateEmployeeInfo();
      },
    },
  };

  function updateEmployeeInfo() {
    let result = '';
    result += $.trim(`${firstName || ''} ${lastName || ''}`);
    result += (result && position) ? (`, ${position}`) : position;
    result += (result && city) ? (`, ${city}`) : city;
    result += (result && state) ? (`, ${state}`) : state;

    $scope.fullInfo = result;
  }
});
