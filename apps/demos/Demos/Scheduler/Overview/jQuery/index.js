$(() => {
  $('.scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2021, 5, 2, 11, 30),
    firstDayOfWeek: 1,
    startDayHour: 8,
    endDayHour: 18,
    showAllDayPanel: false,
    height: 710,
    groups: ['employeeID'],
    resources: [
      {
        fieldExpr: 'employeeID',
        allowMultiple: false,
        dataSource: employees,
        label: 'Employee',
      },
    ],
    dataCellTemplate(cellData, index, container) {
      const { employeeID } = cellData.groups;
      const currentTraining = getCurrentTraining(cellData.startDate.getDate(), employeeID);

      const wrapper = $('<div>')
        .toggleClass(`employee-weekend-${employeeID}`, isWeekEnd(cellData.startDate)).appendTo(container)
        .addClass(`employee-${employeeID}`)
        .addClass('dx-template-wrapper');

      wrapper.append($('<div>')
        .text(cellData.text)
        .addClass(currentTraining)
        .addClass('day-cell'));
    },
    resourceCellTemplate(cellData) {
      const name = $('<div>')
        .addClass('name')
        .css({ backgroundColor: cellData.color })
        .append($('<h2>')
          .text(cellData.text));

      const avatar = $('<div>')
        .addClass('avatar')
        .html(`<img src=${cellData.data.avatar} alt="${cellData.text} photo">`)
        .attr('title', cellData.text);

      const info = $('<div>')
        .addClass('info')
        .css({ color: cellData.color })
        .html(`Age: ${cellData.data.age}<br/><b>${cellData.data.discipline}</b>`);

      return $('<div>').append([name, avatar, info]);
    },
  });

  function isWeekEnd(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function getCurrentTraining(date, employeeID) {
    const result = (date + employeeID) % 3;
    const currentTraining = `training-background-${result}`;

    return currentTraining;
  }
});
