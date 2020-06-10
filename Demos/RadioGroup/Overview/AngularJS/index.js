var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.list = [tasks[1]];
    $scope.radioGroup = {
        simple: {
            items: priorities,
            value: priorities[0]
        },
        disabled: {
            items: priorities,
            value: priorities[1],
            disabled: true
        },
        changeLayout: {
            items: priorities,
            value: priorities[0],
            layout: "horizontal"
        },
        customItemTemplate: {
            items: priorities,
            value: priorities[2],
            itemTemplate: function(itemData, _, itemElement){
                itemElement
                    .parent().addClass(itemData.toLowerCase())
                    .text(itemData);
            }
        },
        eventRadioGroupOptions: {
            items: priorities,
            value: priorities[0],
            onValueChanged: function(e) {
                $scope.list = tasks.filter(function(item) {
                     return item.priority == e.value;
                });
            }
        }
    };
});