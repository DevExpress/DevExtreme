$(() => {
  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'month'],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    startDayHour: 9,
    recurrenceEditMode: 'series',
    groups: [],
    onAppointmentContextMenu(e) {
      const items = getAppointmentContextMenuItems(e);
      contextMenuInstance.option('dataSource', items);
    },
    onCellContextMenu(e) {
      const items = getCellContextMenuItems(e);
      contextMenuInstance.option('dataSource', items);
    },
    resources: [{
      fieldExpr: 'roomId',
      dataSource: resourcesData,
      label: 'Room',
      icon: 'conferenceroomoutline',
    }],
    height: 730,
  });

  const contextMenuInstance = $('#context-menu').dxContextMenu({
    width: 200,
    dataSource: [],
    target: '#scheduler',
    itemTemplate: contextMenuItemTemplate,
    onItemClick: (e) => {
      e.itemData.onItemClick(e);
    },
    onHiding: (e) => {
      e.component.option('dataSource', []);
    },
  }).dxContextMenu('instance');

  function contextMenuItemTemplate(itemData) {
    const template = $('<div></div>');

    if (itemData.color) {
      $('<div>')
        .addClass('item-badge')
        .css('background-color', itemData.color)
        .appendTo(template);
    }
    template.append(itemData.text);
    return template;
  }

  function getAppointmentContextMenuItems(e) {
    const scheduler = e.component;
    const { appointmentData: appointment, targetedAppointmentData: targetedAppointment } = e;

    return [
      {
        text: 'Open',
        onItemClick: () => { scheduler.showAppointmentPopup(appointment); },
      },
      {
        text: 'Delete',
        onItemClick: () => { scheduler.deleteAppointment(appointment); },
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () => {
          scheduler.updateAppointment(appointment, $.extend(appointment, {
            startDate: targetedAppointment.startDate,
            recurrenceRule: 'FREQ=WEEKLY',
          }));
        },
      },
      {
        text: 'Set Room',
        beginGroup: true,
        disabled: true,
      },
      ...resourcesData.map((item) => ({
        ...item,
        onItemClick: (clickEvent) => {
          scheduler.updateAppointment(appointment, $.extend(appointment, {
            roomId: [clickEvent.itemData.id],
          }));
        },
      })),
    ];
  }

  function getCellContextMenuItems(e) {
    const scheduler = e.component;

    return [
      {
        text: 'New Appointment',
        onItemClick: () => {
          scheduler.showAppointmentPopup({
            startDate: e.cellData.startDateUTC,
          }, true);
        },
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => {
          scheduler.showAppointmentPopup({
            startDate: e.cellData.startDateUTC,
            recurrenceRule: 'FREQ=DAILY',
          }, true);
        },
      },
      {
        text: 'Group by Room/Ungroup',
        beginGroup: true,
        onItemClick: () => {
          if (scheduler.option('groups').length) {
            scheduler.option({ crossScrollingEnabled: false, groups: [] });
          } else {
            scheduler.option({ crossScrollingEnabled: true, groups: ['roomId'] });
          }
        },
      },
      {
        text: 'Go to Today',
        onItemClick: () => {
          scheduler.option('currentDate', new Date());
        },
      },
    ];
  }
});
