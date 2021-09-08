$(() => {
  const rangeSelector = $('#range-selector').dxRangeSelector({
    margin: {
      top: 50,
    },
    scale: {
      startValue: new Date(2011, 0, 1),
      endValue: new Date(2011, 11, 31),
      minorTickInterval: 'day',
      tickInterval: 'month',
      minorTick: {
        visible: false,
      },
      marker: { visible: false },
      label: {
        format: 'MMM',
      },
    },
    behavior: {
      callValueChanged: 'onMoving',
    },
    sliderMarker: {
      format: 'dd EEEE',
    },
    title: 'Calculate the Working Days Count in a Date Period',
    onValueChanged(e) {
      const currentDate = new Date(e.value[0]);
      let workingDaysCount = 0;

      while (currentDate <= e.value[1]) {
        if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
          workingDaysCount += 1;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      $('#workingDaysCount').html(workingDaysCount.toFixed());
    },
  }).dxRangeSelector('instance');

  $('#handle').dxSelectBox({
    dataSource: ['onMoving', 'onMovingComplete'],
    width: 210,
    value: 'onMoving',
    onValueChanged(data) {
      rangeSelector.option('behavior.callValueChanged', data.value);
    },
  });
});
