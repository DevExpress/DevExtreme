const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.employees = employees;
  $scope.dataGridOptions = {
    bindingOptions: {
      dataSource: 'employees',
    },
    columns: ['FirstName', 'LastName', 'BirthYear', 'City', 'Title'],
    showBorders: true,
    columnAutoWidth: true,
  };
  $scope.rangeSelectorOptions = {
    margin: {
      top: 20,
    },
    dataSource: employees,
    dataSourceField: 'BirthYear',
    scale: {
      tickInterval: 1,
      minorTickInterval: 1,
      label: {
        format: {
          type: 'decimal',
        },
      },
    },
    behavior: {
      valueChangeMode: 'onHandleMove',
    },
    title: 'Filter Employee List by Birth Year',
    onValueChanged(e) {
      const selectedEmployees = $.grep(
        employees,
        (employee) => employee.BirthYear >= e.value[0] && employee.BirthYear <= e.value[1],
      );
      $scope.employees = selectedEmployees;
    },
  };
});
