const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const algorithms = ['sliceAndDice', 'squarified', 'strip', 'custom'];
  $scope.currentAlgorithmName = algorithms[2];
  $scope.currentAlgorithm = $scope.currentAlgorithmName;

  $scope.treeMapOptions = {
    bindingOptions: {
      layoutAlgorithm: 'currentAlgorithm',
    },
    dataSource: populationByAge,
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
            (100 * data.value / parentData.total).toFixed(1)}%)`;
        } else {
          result = `<span class='country'>${data.name}</span>`;
        }

        return {
          text: result,
        };
      },
    },
  };

  $scope.selectBoxOptions = {
    bindingOptions: {
      value: 'currentAlgorithmName',
    },
    items: algorithms,
    width: 200,
    onValueChanged(data) {
      if (data.value === 'custom') {
        $scope.currentAlgorithm = customAlgorithm;
      } else {
        $scope.currentAlgorithm = data.value;
      }
    },
  };

  function customAlgorithm(arg) {
    let side = 0;
    const totalRect = arg.rect.slice();
    let totalSum = arg.sum;

    arg.items.forEach((item) => {
      const size = Math.round((totalRect[side + 2]
                    - totalRect[side]) * item.value / totalSum);
      const rect = totalRect.slice();

      totalSum -= item.value;
      rect[side + 2] = totalRect[side] += size;
      item.rect = rect;
      side = 1 - side;
    });
  }
});
