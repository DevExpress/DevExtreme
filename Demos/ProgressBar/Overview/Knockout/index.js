window.onload = function() {
    var progressBarValue = ko.observable(0),
        buttonText = ko.observable("Start progress"),
        seconds = 10,
        inProgress = false,
        intervalId;
    
    function setCurrentStatus() {
        progressBarValue((10 - seconds) * 10);
        $("#timer").text(("0" + seconds).slice(-2));
    }
    
    function timer() {
        seconds--;
        setCurrentStatus();
        if(seconds === 0) {
            clearInterval(intervalId);
            seconds = 10;
            return;
        }
    }
    
    var viewModel = {
        progressBarOptions: {
            min: 0,
            max: 100,
            value: progressBarValue,
            width: "90%",
            statusFormat:  function(value) { 
                return "Loading: " + value * 100 + "%"; 
            },
            onComplete: function(e){
                inProgress = false;
                buttonText("Restart progress");
                e.element.addClass("complete");
            }
        },
        buttonOptions: {
            text: buttonText,
            width: 200,
            onClick: function() {
                $("#progressBarStatus").removeClass("complete");
                if (inProgress) {
                    buttonText("Continue progress");
                    clearInterval(intervalId);
                } else {
                    buttonText("Stop progress");
                    setCurrentStatus();
                    intervalId = setInterval(timer, 1000);
                }
                inProgress = !inProgress;
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("progress-bar"));
};