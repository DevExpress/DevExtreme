$(() => {
  const year = 2025;
  let selectedMonth = 1;

  const startOfMonthStr = (month) => `${month}/01/${year}`;
  const endOfMonthStr = (month) => {
    const nextMonth = (month === 12) ? 1 : month + 1;
    const nextYear = (month === 12) ? year + 1 : year;

    const lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();

    return `${month}/${lastDay}/${year}`;
  };

  const chartDataSource = new DevExpress.data.DataSource({
    store: new DevExpress.data.CustomStore({
      key: 'Date',
      load: () => {
        const startVisible = startOfMonthStr(selectedMonth);
        const endVisible = endOfMonthStr(selectedMonth);
        const url = 'https://js.devexpress.com/Demos/NetCore/api/TemperatureData'
          + `?startVisible=${encodeURIComponent(startVisible)}`
          + `&endVisible=${encodeURIComponent(endVisible)}`
          + `&startBound=${encodeURIComponent(startVisible)}`
          + `&endBound=${encodeURIComponent(endVisible)}`;

        return fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(`Network response fails: ${r.status}`);
            return r.json();
          })
          .then((arr) => arr.map((item) => ({
            ...item,
            Temperature: (item.MinTemp + item.MaxTemp) / 2,
            Date: new Date(item.Date),
          })));
      },
    }),
    paginate: false,
  });

  $('#chart').dxChart({
    dataSource: chartDataSource,
    title: `Temperature in Seattle, ${year}`,
    size: {
      height: 420,
    },
    series: {
      argumentField: 'Date',
      valueField: 'Temperature',
      type: 'spline',
    },
    legend: {
      visible: false,
    },
    commonPaneSettings: {
      border: {
        visible: true,
        width: 2,
        top: false,
        right: false,
      },
    },
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        return { text: `${arg.valueText}&#176C` };
      },
    },
    valueAxis: {
      valueType: 'numeric',
      grid: {
        opacity: 0.2,
      },
      label: {
        customizeText() {
          return `${this.valueText}&#176C`;
        },
      },
    },
    argumentAxis: {
      type: 'discrete',
      grid: {
        visible: true,
        opacity: 0.5,
      },
      label: {
        customizeText() { return new Date(this.value).getDate(); },
      },
    },
    loadingIndicator: {
      enabled: true,
    },
  });

  $('#selectbox').dxSelectBox({
    width: 150,
    items: months,
    value: selectedMonth,
    inputAttr: { 'aria-label': 'Month' },
    valueExpr: 'id',
    displayExpr: 'name',
    onValueChanged(data) {
      selectedMonth = data.value;
      chartDataSource.load();
    },
  });
});
