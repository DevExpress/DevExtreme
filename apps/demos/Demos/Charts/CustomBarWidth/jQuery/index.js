$(() => {
  $('#chart').dxChart({
    palette: 'soft',
    dataSource,
    commonSeriesSettings: {
      barPadding: 0.5,
      argumentField: 'state',
      type: 'bar',
    },
    series: [
      { valueField: 'year1990', name: '1990' },
      { valueField: 'year2000', name: '2000' },
      { valueField: 'year2010', name: '2010' },
      { valueField: 'year2020', name: '2020' },
      { valueField: 'year2021', name: '2021' },
      { valueField: 'year2022', name: '2022' },
    ],
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
    },
    export: {
      enabled: true,
    },
    title: {
      text: 'Oil Production',
      subtitle: {
        text: '(in millions tonnes)',
      },
    },
  });
});
