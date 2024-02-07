const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.filterValueText = null;
  $scope.dataSourceValueText = null;

  $scope.filterBuilderOptions = {
    fields,
    value: filter,
    maxGroupLevel: 1,
    groupOperations: ['and', 'or'],
    onInitialized: updateTexts,
    onValueChanged: updateTexts,
    customOperations: [{
      name: 'anyof',
      caption: 'Is any of',
      icon: 'check',
      editorTemplate: 'tagBoxTemplate',
      calculateFilterExpression(filterValue, field) {
        return filterValue && filterValue.length
                    && Array.prototype.concat.apply([], filterValue.map((value) => [[field.dataField, '=', value], 'or'])).slice(0, -1);
      },
    }],
  };

  $scope.categories = categories;
  $scope.onTagBoxValueChanged = function (e) {
    e.model.data.setValue(e.value && e.value.length ? e.value : null);
  };

  const TAB_SIZE = 4;

  function updateTexts(e) {
    $scope.filterText = formatValue(e.component.option('value'));
    $scope.dataSourceText = formatValue(e.component.getFilterExpression());
  }

  function formatValue(value, spaces = TAB_SIZE) {
    if (value && Array.isArray(value[0])) {
      return `[${getLineBreak(spaces)}${value.map((item) => (Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item))).join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
    }
    return JSON.stringify(value);
  }

  function getLineBreak(spaces) {
    return `\r\n${new Array(spaces + 1).join(' ')}`;
  }
});
