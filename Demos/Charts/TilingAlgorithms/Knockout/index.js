window.onload = function () {
  const algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];
  const currentAlgorithmName = ko.observable(algorithms[2]);
  const currentAlgorithm = ko.observable(currentAlgorithmName());

  const viewModel = {
    treeMapOptions: {
      dataSource: populationByAge,
      colorizer: {
        type: 'discrete',
        colorizeGroups: true,
      },
      title: 'Population by Age Groups',
      layoutAlgorithm: currentAlgorithm,
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
    },
    selectBoxOptions: {
      items: algorithms,
      value: currentAlgorithmName,
      width: 200,
      onValueChanged(data) {
        if (data.value === 'custom') {
          currentAlgorithm(customAlgorithm);
        } else {
          currentAlgorithm(data.value);
        }
      },
    },
  };

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

  ko.applyBindings(viewModel, document.getElementById('treemap-demo'));
};
