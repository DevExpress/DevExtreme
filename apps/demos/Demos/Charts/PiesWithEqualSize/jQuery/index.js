$(() => {
  const legendSettings = {
    verticalAlignment: 'bottom',
    horizontalAlignment: 'center',
    itemTextPosition: 'right',
    rowCount: 2,
  };
  const seriesOptions = [{
    argumentField: 'name',
    valueField: 'area',
    label: {
      visible: true,
      format: 'percent',
    },
  }];
  const sizeGroupName = 'piesGroup';

  $('#countries').dxPieChart({
    dataSource: countries,
    sizeGroup: sizeGroupName,
    palette: 'Soft',
    title: 'Area of Countries',
    legend: legendSettings,
    series: seriesOptions,
  });

  $('#waterLandRatio').dxPieChart({
    sizeGroup: sizeGroupName,
    palette: 'Soft Pastel',
    title: 'Water/Land Ratio',
    legend: legendSettings,
    dataSource: waterLandRatio,
    series: seriesOptions,
  });
});
