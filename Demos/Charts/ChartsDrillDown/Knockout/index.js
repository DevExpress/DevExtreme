window.onload = function () {
  const isFirstLevel = ko.observable(true);
  const dataSource = ko.observable(filterData(''));
  const buttonIsVisible = ko.computed(() => !isFirstLevel());

  const viewModel = {
    chartOptions: {
      dataSource,
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
        if (isFirstLevel()) {
          isFirstLevel(false);
          removePointerCursor();
          dataSource(filterData(e.target.originalArgument));
        }
      },
      customizePoint() {
        const pointSettings = {
          color: colors[Number(isFirstLevel())],
        };

        if (!isFirstLevel()) {
          pointSettings.hoverStyle = {
            hatching: 'none',
          };
        }

        return pointSettings;
      },
    },
    buttonOptions: {
      text: 'Back',
      icon: 'chevronleft',
      visible: buttonIsVisible,
      onClick() {
        if (!isFirstLevel()) {
          isFirstLevel(true);
          addPointerCursor();
          dataSource(filterData(''));
        }
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));

  addPointerCursor();

  function filterData(name) {
    return data.filter((item) => item.parentID === name);
  }

  function addPointerCursor() {
    document.getElementById('chart').classList.add('pointer-on-bars');
  }

  function removePointerCursor() {
    document.getElementById('chart').classList.remove('pointer-on-bars');
  }
};
