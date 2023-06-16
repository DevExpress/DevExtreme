const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const now = new Date();

  $scope.dateBox = {
    dateFormat: {
      type: 'date',
      value: now,
      inputAttr: { 'aria-label': 'Date' },
    },
    timeFormat: {
      type: 'time',
      value: now,
      inputAttr: { 'aria-label': 'Time' },
    },
    dateTimeFormat: {
      type: 'datetime',
      value: now,
      inputAttr: { 'aria-label': 'Date and time' },
    },
    customFormat: {
      displayFormat: 'EEEE, MMM dd',
      value: now,
      inputAttr: { 'aria-label': 'Custom format' },
    },
    dateByPicker: {
      pickerType: 'rollers',
      value: now,
      inputAttr: { 'aria-label': 'Date picker' },
    },
    disabled: {
      type: 'datetime',
      disabled: true,
      value: now,
      inputAttr: { 'aria-label': 'Disabled Date and time' },
    },
    disabledDates: {
      type: 'date',
      pickerType: 'calendar',
      value: new Date(2017, 0, 3),
      disabledDates: federalHolidays,
      inputAttr: { 'aria-label': 'Disabled certain dates' },
    },
    clear: {
      type: 'time',
      showClearButton: true,
      value: new Date(2015, 11, 1, 6),
      inputAttr: { 'aria-label': 'Clear button' },
    },
    eventOptions: {
      applyValueMode: 'useButtons',
      value: new Date(1981, 3, 27),
      max: new Date(),
      min: new Date(1900, 0, 1),
      inputAttr: { 'aria-label': 'Set Birthday' },
      bindingOptions: {
        value: 'dateBox.eventOptions.value',
      },
      diffInDay() {
        return `${Math.floor(Math.abs((new Date() - $scope.dateBox.eventOptions.value) / (24 * 60 * 60 * 1000)))} days`;
      },
    },
  };
});
