var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.filterValueText = null;
    $scope.dataSourceValueText = null;

    $scope.filterBuilderOptions = {
        fields: fields,
        value: filter,
        maxGroupLevel: 1,
        groupOperations: ["and", "or"],
        onInitialized: updateTexts,
        onValueChanged: updateTexts,
        customOperations: [{
            name: "anyof",
            caption: "Is any of",
            icon: "check",
            editorTemplate: "tagBoxTemplate",
            calculateFilterExpression: function(filterValue, field) {
                return filterValue && filterValue.length
                    && Array.prototype.concat.apply([], filterValue.map(function(value) {
                        return [[field.dataField, "=", value], "or"];
                    })).slice(0, -1);
            }
        }]
    };

    $scope.categories = categories;
    $scope.onTagBoxValueChanged = function(e) {
        e.model.data.setValue(e.value && e.value.length ? e.value : null);
    };

    function updateTexts(e) {
        $scope.filterText = formatValue(e.component.option("value"));
        $scope.dataSourceText = formatValue(e.component.getFilterExpression());
    }

    function formatValue(value, spaces) {
        if(value && Array.isArray(value[0])) {
            var TAB_SIZE = 4;
            spaces = spaces || TAB_SIZE;
            return "[" + getLineBreak(spaces) + value.map(function(item) {
                return Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item);
            }).join("," + getLineBreak(spaces)) + getLineBreak(spaces - TAB_SIZE) + "]";
        }
        return JSON.stringify(value);
    }

    function getLineBreak(spaces) {
        return "\r\n" + new Array(spaces + 1).join(" ");
    }
});