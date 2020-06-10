var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.emailValue = "smith@corp.com";
    $scope.textBox = {
        simple: {
            value: "John Smith"
        },
        withPlaceholder: {
            placeholder: "Enter full name here..."
        },
        withClearButton: {
            value: "John Smith",
            showClearButton: true
        },
        passwordMode: {
            mode: "password",
            placeholder: "Enter password",
            showClearButton: true,
            value: "f5lzKs0T",
        },
        maskUsage: {
            mask: "+1 (X00) 000-0000",
            maskRules: {"X": /[02-9]/}
        },
        disabled: {
            value: "John Smith",
            disabled: true
        },
        fullName: {
            value: "Smith",
            showClearButton: true,
            placeholder: "Enter full name",
            valueChangeEvent: "keyup",
            onValueChanged: function(data) {
                $scope.emailValue = data.value.replace(/\s/g, "").toLowerCase() + "@corp.com";
            }
        },
        email: {
            readOnly: true,
            hoverStateEnabled: false,
            bindingOptions: {
                value: "emailValue"
            }
        }
    };
});