var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var valueChangeEvents = [{
        title: "On Blur",
        name: "change"
    }, {
        title: "On Key Up",
        name: "keyup"
    }];
    
    $scope.maxLength = null;
    $scope.value = longText;
    $scope.eventValue = valueChangeEvents[0].name;
    $scope.valueForEditableTextArea = longText;
        
    $scope.textAreaWithMaxLength = {
        height: 90,
        bindingOptions: {
            maxLength: "maxLength",
            value: "value"
        }
    };
    
    $scope.checkBoxOptions = {
        value: false,
        onValueChanged: function(data) {
            if (data.value) {
                $scope.value = longText.substring(0, 100);
                $scope.maxLength = 100;
            } else {
                $scope.value = longText;
                $scope.maxLength = null;
            }
        },
        text: "Limit text length"
    };
        
    $scope.selectBoxOptions = {
        items: valueChangeEvents,    
        valueExpr: "name",
        displayExpr: "title",
        bindingOptions: {
            value: "eventValue"
        }
    };
    
    $scope.editableTextArea = {
        height: 90,
        bindingOptions: {
            value: "valueForEditableTextArea",
            valueChangeEvent: "eventValue"
        }
    };
    
    $scope.disabledTextArea = {
        height: 90,
        readOnly: true,
        bindingOptions: {
            value: "valueForEditableTextArea"
        }
    };
    
});