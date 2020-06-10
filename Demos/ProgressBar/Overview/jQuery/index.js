$(function(){
    var seconds = 10,
        inProgress = false,
        intervalId;

    var progressBarStatus = $("#progressBarStatus").dxProgressBar({
        min: 0,
        max: 100,
        width: "90%",
        statusFormat:  function(value) { 
            return "Loading: " + value * 100 + "%"; 
        },
        onComplete: function(e){
            inProgress = false;
            progressButton.option("text", "Restart progress");
            e.element.addClass("complete");
        }
    }).dxProgressBar("instance");
    
    var progressButton = $("#progress-button").dxButton({
        text: "Start progress",
        width: 200,
        onClick: function() {
            $("#progressBarStatus").removeClass("complete");
            if (inProgress) {
                progressButton.option("text", "Continue progress");
                clearInterval(intervalId);
            } else {
                progressButton.option("text", "Stop progress");
                setCurrentStatus();
                intervalId = setInterval(timer, 1000);
            }
            inProgress = !inProgress;
        }
    }).dxButton("instance");
    
    function setCurrentStatus() {
        progressBarStatus.option("value", (10 - seconds) * 10);
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
});