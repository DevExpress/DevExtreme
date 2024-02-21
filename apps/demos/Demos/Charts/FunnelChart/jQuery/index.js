$(() => {
  $('#funnel').dxFunnel({
    dataSource: data,
    title: {
      text: 'Website Conversions',
      margin: { bottom: 30 },
    },
    argumentField: 'argument',
    valueField: 'value',
    palette: 'Soft Pastel',
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      format: 'fixedPoint',
    },
    item: {
      border: {
        visible: true,
      },
    },
    label: {
      visible: true,
      position: 'inside',
      backgroundColor: 'none',
      customizeText(e) {
        return `<span style='font-size: 28px'>${
          e.percentText
        }</span><br/>${
          e.item.argument}`;
      },
    },
  });
});
