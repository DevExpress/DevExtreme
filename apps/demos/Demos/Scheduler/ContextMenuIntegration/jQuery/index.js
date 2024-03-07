$(() => {
  const appointmentClassName = '.dx-scheduler-appointment';
  const cellClassName = '.dx-scheduler-date-table-cell';

  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'month'],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    startDayHour: 9,
    recurrenceEditMode: 'series',
    onAppointmentContextMenu(e) {
      updateContextMenu(
        false,
        appointmentContextMenuItems,
        appointmentClassName,
        itemTemplate,
        onItemClick(e),
      );
    },
    onCellContextMenu(e) {
      updateContextMenu(false, cellContextMenuItems, cellClassName, 'item', onItemClick(e));
    },
    resources: [{
      fieldExpr: 'roomId',
      dataSource: resourcesData,
      label: 'Room',
    }],
    height: 730,
  });

  const contextMenuInstance = $('#context-menu').dxContextMenu({
    width: 200,
    dataSource: [],
    disabled: true,
    target: appointmentClassName,
  }).dxContextMenu('instance');

  const updateContextMenu = function (disable, dataSource, target, itemTemplate, onItemClick) {
    contextMenuInstance.option({
      dataSource,
      target,
      itemTemplate,
      onItemClick,
      disabled: disable,
    });
  };

  const itemTemplate = function (itemData) {
    return getAppointmentMenuTemplate(itemData);
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

  const groupCell = function (e) {
    const scheduler = e.component;

    if (scheduler.option('groups')) {
      scheduler.option({ crossScrollingEnabled: false, groups: undefined });
    } else {
      scheduler.option({ crossScrollingEnabled: true, groups: ['roomId'] });
    }
  };

  const showCurrentDate = function (e) {
    e.component.option('currentDate', new Date());
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

  const getAppointmentMenuTemplate = function (itemData) {
    const template = $('<div></div>');

    if (itemData.color) {
      template.append(`<div class='item-badge' style='background-color:${itemData.color};'></div>`);
    }
    template.append(itemData.text);
    return template;
  };
});
