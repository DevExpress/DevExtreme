window.onload = function () {
  const selectedEmployees = ko.observable(employees);

  const viewModel = {
    selectedEmployees,
    dataGridOptions: {
      dataSource: selectedEmployees,
      columns: ['FirstName', 'LastName', 'BirthYear', 'City', 'Title'],
      showBorders: true,
      columnAutoWidth: true,
    },
    rangeSelectorOptions: {
      margin: {
        top: 20,
      },
      dataSource: employees,
      scale: {
        tickInterval: 1,
        minorTickInterval: 1,
        label: {
          format: {
            type: 'decimal',
          },
        },
      },
      dataSourceField: 'BirthYear',
      behavior: {
        valueChangeMode: 'onHandleMove',
      },
      title: 'Filter Employee List by Birth Year',
      onValueChanged(e) {
        const employeesValue = $.grep(
          employees,
          (employee) => employee.BirthYear >= e.value[0] && employee.BirthYear <= e.value[1],
        );
        selectedEmployees(employeesValue);
      },
    },
  };

  ko.applyBindings(viewModel, $('#range-selector-demo').get(0));
};
