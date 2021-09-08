$(() => {
  let isFirstLevel = true;
  const chartContainer = $('#chart');
  const chart = chartContainer.dxChart({
    dataSource: filterData(''),
    title: 'The Most Populated Countries by Continents',
    series: {
      type: 'bar',
    },
    legend: {
      visible: false,
    },
    valueAxis: {
      showZero: false,
    },
    onPointClick(e) {
      if (isFirstLevel) {
        isFirstLevel = false;
        removePointerCursor(chartContainer);
        chart.option({
          dataSource: filterData(e.target.originalArgument),
        });
        $('#backButton')
          .dxButton('instance')
          .option('visible', true);
      }
    },
    customizePoint() {
      const pointSettings = {
        color: colors[Number(isFirstLevel)],
      };

      if (!isFirstLevel) {
        pointSettings.hoverStyle = {
          hatching: 'none',
        };
      }

      return pointSettings;
    },
  }).dxChart('instance');

  $('#backButton').dxButton({
    text: 'Back',
    icon: 'chevronleft',
    visible: false,
    onClick() {
      if (!isFirstLevel) {
        isFirstLevel = true;
        addPointerCursor(chartContainer);
        chart.option('dataSource', filterData(''));
        this.option('visible', false);
      }
    },
  });

  addPointerCursor(chartContainer);
});

function filterData(name) {
  return data.filter((item) => item.parentID === name);
}

function addPointerCursor(container) {
  container.addClass('pointer-on-bars');
}

function removePointerCursor(container) {
  container.removeClass('pointer-on-bars');
}
