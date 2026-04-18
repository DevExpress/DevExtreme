$(() => {
  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: [{
      type: 'workWeek',
      groupOrientation: 'horizontal',
      cellDuration: 30,
    }],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 21),
    startDayHour: 9,
    endDayHour: 16,
    groups: ['priorityId'],
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: priorityData,
      label: 'Priority',
    }],
    showCurrentTimeIndicator: false,
    allDayPanelMode: 'allDay',
    onSelectionEnd(e) {
      const cells = e.selectedCellData;
      if (cells.length <= 1) {
        return;
      }

      const startDate = cells[0].startDateUTC || cells[0].startDate;
      const endDate = cells[cells.length - 1].endDateUTC || cells[cells.length - 1].endDate;

      e.component.showAppointmentPopup({
        startDate,
        endDate,
        ...cells[0].groups,
      }, true);
    },
  });
});
