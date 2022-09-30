window.onload = function () {
  const zoomLevels = ['month', 'year', 'decade', 'century'];
  const holidays = [[1, 0], [4, 6], [25, 11]];
  const useCellTemplate = ko.observable(false);
  const disableWeekend = ko.observable(false);
  const cellTemplate = ko.computed(() => {
    if (useCellTemplate()) { return getCellTemplate; }
    return 'cell';
  });
  const disabledDates = ko.computed(() => {
    if (disableWeekend()) {
      return isDateDisabled;
    }
    return null;
  });
  const viewModel = {
    now: new Date(),
    zoomLevels,
    currentValue: ko.observable(new Date()),
    calendarDisabled: ko.observable(false),
    isMondayFirst: ko.observable(false),
    useMinDate: ko.observable(false),
    useMaxDate: ko.observable(false),
    disableWeekend,
    disabledDates,
    zoomLevel: ko.observable(zoomLevels[0]),
    cellTemplate,
    useCellTemplate,
  };

  function isWeekend(date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  function getCellTemplate(data) {
    let cssClass = '';
    if (isWeekend(data.date)) { cssClass = 'weekend'; }

    $.each(holidays, (_, item) => {
      if (data.date.getDate() === item[0] && data.date.getMonth() === item[1]) {
        cssClass = 'holiday';
        return false;
      }
      return true;
    });

    return `<span class='${cssClass}'>${data.text}</span>`;
  }

  function isDateDisabled(data) {
    return data.view === 'month' && isWeekend(data.date);
  }

  ko.applyBindings(viewModel, document.getElementById('calendar-demo'));
};
