var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var seconds = 10,
        inProgress = false,
        intervalId;
    
    $scope.progressBarValue = 0;
    $scope.buttonText = "Start progress";
    
    $scope.progressBarOptions = {
        min: 0,
        max: 100,
        width: "90%",
        bindingOptions: {
            value: "progressBarValue"
        },
        statusFormat:  function(value) { 
            return "Loading: " + value * 100 + "%"; 
        },
        onComplete: function(e){
            inProgress = false;
            $scope.buttonText = "Restart progress";
            e.element.addClass("complete");
        }
    };
    
    $scope.buttonOptions = {
        width: 200,
        bindingOptions: {
            text: "buttonText"
        },
        onClick: function() {
            $("#progressBarStatus").removeClass("complete");
            if (inProgress) {
                $scope.buttonText = "Continue progress";
                clearInterval(intervalId);
            } else {
                $scope.buttonText = "Stop progress";
                setCurrentStatus();
                intervalId = setInterval(timer, 1000);
            }
            inProgress = !inProgress;
        }
    };
    
    function setCurrentStatus() {
        $scope.progressBarValue = (10 - seconds) * 10;
        $("#timer").text(("0" + seconds).slice(-2));
    }
        
    function timer() {
        seconds--;
        $scope.$apply(function() {
            setCurrentStatus();
        });
        if(seconds === 0) {
            clearInterval(intervalId);
            seconds = 10;
            return;
        }
    }
});