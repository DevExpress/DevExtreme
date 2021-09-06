const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const now = new Date();

  $scope.dateBox = {
    dateFormat: {
      type: 'date',
      value: now,
    },
    timeFormat: {
      type: 'time',
      value: now,
    },
    dateTimeFormat: {
      type: 'datetime',
      value: now,
    },
    customFormat: {
      displayFormat: 'EEEE, MMM dd',
      value: now,
    },
    dateByPicker: {
      pickerType: 'rollers',
      value: now,
    },
    disabled: {
      type: 'datetime',
      disabled: true,
      value: now,
    },
    disabledDates: {
      type: 'date',
      pickerType: 'calendar',
      value: new Date(2017, 0, 3),
      disabledDates: federalHolidays,
    },
    clear: {
      type: 'time',
      showClearButton: true,
      value: new Date(2015, 11, 1, 6),
    },
    eventOptions: {
      applyValueMode: 'useButtons',
      value: new Date(1981, 3, 27),
      max: new Date(),
      min: new Date(1900, 0, 1),
      bindingOptions: {
        value: 'dateBox.eventOptions.value',
      },
      diffInDay() {
        return `${Math.floor(Math.abs((new Date() - $scope.dateBox.eventOptions.value) / (24 * 60 * 60 * 1000)))} days`;
      },
    },
  };
});
