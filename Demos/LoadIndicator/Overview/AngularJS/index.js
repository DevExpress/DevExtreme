var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var buttonIndicator;

    $scope.buttonOptions = {
        text: "Send",
        height: 40,
        width: 180,
        template: function(data, container) {
            $("<div class='button-indicator'></div><span class='dx-button-text'>" + data.text + "</span>").appendTo(container);
            buttonIndicator = container.find(".button-indicator").dxLoadIndicator({
                    visible: false
            }).dxLoadIndicator("instance");
        },
        onClick: function(data) {
            data.component.option("text", "Sending");
            buttonIndicator.option("visible", true);
            setTimeout(function() {
                buttonIndicator.option("visible", false);
                data.component.option("text", "Send");
            }, 2000);
        }
    };
});