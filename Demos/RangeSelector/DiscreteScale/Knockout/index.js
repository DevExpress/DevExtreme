window.onload = function () {
  const totalResult = ko.observable('12,809,000');

  const viewModel = {
    totalResult,
    rangeSelectorOptions: {
      dataSource,
      chart: {
        commonSeriesSettings: {
          argumentField: 'country',
          type: 'bar',
        },
        series: [
          { valueField: 'copper', name: 'Copper' },
        ],
      },
      title: 'Copper Production in 2013',
      onValueChanged(e) {
        const data = e.component.option('dataSource');
        let total = 0;
        let startIndex;
        let endIndex;

        data.forEach((item, i) => {
          if (item.country === e.value[0]) {
            startIndex = i;
          } else if (item.country === e.value[1]) {
            endIndex = i;
          }
        });

        if (endIndex) {
          data
            .slice(startIndex, endIndex + 1)
            .forEach((item) => {
              total += item.copper;
            });
        } else {
          total = data[startIndex].copper;
        }

        totalResult(formatNumber(total));
      },
    },
  };

  const formatNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format;

  ko.applyBindings(viewModel, $('#range-selector-demo').get(0));
};
