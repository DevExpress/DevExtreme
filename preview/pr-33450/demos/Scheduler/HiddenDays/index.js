$(() => {
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let visibleDays = [0, 1, 2, 4, 6];
  const VALIDATION_MESSAGE = 'The hiddenWeekDays option cannot hide all days of the week. At least one day must remain visible.';

  function computeHiddenWeekDays() {
    return [0, 1, 2, 3, 4, 5, 6].filter((d) => !visibleDays.includes(d));
  }

  function refreshValidity() {
    $('.hidden-days-demo').toggleClass('is-invalid', visibleDays.length === 0);
  }

  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: new DevExpress.data.ArrayStore({
      key: 'id',
      data,
    }),
    views: ['week', 'workWeek', 'month', 'timelineWeek', 'agenda'],
    hiddenWeekDays: computeHiddenWeekDays(),
    currentView: 'week',
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 730,
  }).dxScheduler('instance');

  const $optionsPanel = $('.options');
  dayLabels.forEach((label, idx) => {
    const $cb = $('<div class="option"></div>').appendTo($optionsPanel);
    $cb.dxCheckBox({
      text: label,
      value: visibleDays.includes(idx),
      onValueChanged(e) {
        if (e.value) {
          visibleDays = [...visibleDays, idx];
        } else {
          visibleDays = visibleDays.filter((d) => d !== idx);
        }
        refreshValidity();
        scheduler.option('hiddenWeekDays', computeHiddenWeekDays());
      },
    });
  });

  $('<div class="validation-message"></div>').text(VALIDATION_MESSAGE).appendTo($optionsPanel);
  refreshValidity();
});
