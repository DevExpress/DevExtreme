$(() => {
  const algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];
  let currentAlgorithm = algorithms[2];

  const treeMap = $('#treemap').dxTreeMap({
    dataSource: populationByAge,
    layoutAlgorithm: currentAlgorithm,
    colorizer: {
      type: 'discrete',
      colorizeGroups: true,
    },
    title: 'Population by Age Groups',
    tooltip: {
      enabled: true,
      format: 'thousands',
      customizeTooltip(arg) {
        const { data } = arg.node;
        const parentData = arg.node.getParent().data;
        let result = '';

        if (arg.node.isLeaf()) {
          result = `<span class='country'>${parentData.name}</span><br />${
            data.name}<br />${arg.valueText} (${
            ((100 * data.value) / parentData.total).toFixed(1)}%)`;
        } else {
          result = `<span class='country'>${data.name}</span>`;
        }

        return {
          text: result,
        };
      },
    },
  }).dxTreeMap('instance');

  $('#algorithm').dxSelectBox({
    items: algorithms,
    width: 200,
    inputAttr: { 'aria-label': 'Algorithm' },
    value: currentAlgorithm,
    onValueChanged(data) {
      if (data.value === 'custom') {
        currentAlgorithm = customAlgorithm;
      } else {
        currentAlgorithm = data.value;
      }

      treeMap.option('layoutAlgorithm', currentAlgorithm);
    },
  });

  function customAlgorithm(arg) {
    let side = 0;
    const totalRect = arg.rect.slice();
    let totalSum = arg.sum;

    arg.items.forEach((item) => {
      const size = Math.round(((totalRect[side + 2]
                    - totalRect[side]) * item.value) / totalSum);
      const rect = totalRect.slice();

      totalSum -= item.value;
      totalRect[side] += size;
      rect[side + 2] = totalRect[side];
      item.rect = rect;
      side = 1 - side;
    });
  }
});
