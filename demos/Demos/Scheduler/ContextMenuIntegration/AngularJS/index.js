const DemoApp = angular.module('DemoApp', ['dx']);

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

DemoApp.controller('DemoController', ($scope) => {
  $scope.groups = undefined;
  $scope.crossScrolling = false;
  $scope.currentDate = new Date(2020, 10, 25);

  $scope.dataSource = [];
  $scope.disabled = true;
  $scope.target = appointmentClassName;
  $scope.itemTemplate = undefined;
  $scope.onItemClick = undefined;

  $scope.contextMenuOptions = {
    width: 200,
    bindingOptions: {
      dataSource: 'dataSource',
      disabled: 'disabled',
      target: 'target',
      itemTemplate: 'itemTemplate',
      onItemClick: 'onItemClick',
    },
  };

  $scope.schedulerOptions = {
    timeZone: 'America/Los_Angeles',
    bindingOptions: {
      groups: 'groups',
      crossScrollingEnabled: 'crossScrolling',
      currentDate: 'currentDate',
    },
    dataSource: data,
    views: ['day', 'month'],
    currentView: 'month',
    startDayHour: 9,
    recurrenceEditMode: 'series',
    onAppointmentContextMenu(e) {
      $scope.target = appointmentClassName;
      $scope.disabled = false;
      $scope.dataSource = appointmentContextMenuItems;
      $scope.itemTemplate = 'item-template';
      $scope.onItemClick = onItemClick(e);
    },
    onCellContextMenu(e) {
      $scope.target = cellClassName;
      $scope.disabled = false;
      $scope.dataSource = cellContextMenuItems;
      $scope.itemTemplate = 'item';
      $scope.onItemClick = onItemClick(e);
    },
    resources: [{
      fieldExpr: 'roomId',
      dataSource: resourcesData,
      label: 'Room',
    }],
    height: 730,
  };

  const onItemClick = function (contextMenuEvent) {
    return function (e) {
      e.itemData.onItemClick(contextMenuEvent, e);
    };
  };

  const createAppointment = function (e) {
    e.component.showAppointmentPopup({
      startDate: e.cellData.startDate,
    }, true);
  };

  const createRecurringAppointment = function (e) {
    e.component.showAppointmentPopup({
      startDate: e.cellData.startDate,
      recurrenceRule: 'FREQ=DAILY',
    }, true);
  };

  const groupCell = function () {
    if ($scope.groups && $scope.groups.length) {
      $scope.crossScrolling = false;
      $scope.groups = undefined;
    } else {
      $scope.crossScrolling = true;
      $scope.groups = ['roomId'];
    }
  };

  const showCurrentDate = function () {
    $scope.currentDate = new Date();
  };

  const showAppointment = function (e) {
    e.component.showAppointmentPopup(e.appointmentData);
  };

  const deleteAppointment = function (e) {
    e.component.deleteAppointment(e.appointmentData);
  };

  const repeatAppointmentWeekly = function (e) {
    const itemData = e.appointmentData;

    e.component.updateAppointment(itemData, $.extend(itemData, {
      startDate: e.targetedAppointmentData.startDate,
      recurrenceRule: 'FREQ=WEEKLY',
    }));
  };

  const setResource = function (e, clickEvent) {
    const itemData = e.appointmentData;

    e.component.updateAppointment(itemData, $.extend(itemData, {
      roomId: [clickEvent.itemData.id],
    }));
  };

  const cellContextMenuItems = [
    { text: 'New Appointment', onItemClick: createAppointment },
    { text: 'New Recurring Appointment', onItemClick: createRecurringAppointment },
    { text: 'Group by Room/Ungroup', beginGroup: true, onItemClick: groupCell },
    { text: 'Go to Today', onItemClick: showCurrentDate },
  ];

  let appointmentContextMenuItems = [
    { text: 'Open', onItemClick: showAppointment },
    { text: 'Delete', onItemClick: deleteAppointment },
    { text: 'Repeat Weekly', beginGroup: true, onItemClick: repeatAppointmentWeekly },
    { text: 'Set Room', beginGroup: true, disabled: true },
  ];

  $.each(resourcesData, (i, item) => {
    item.onItemClick = setResource;
  });

  appointmentContextMenuItems = $.merge(appointmentContextMenuItems, resourcesData);
});
