window.onload = function() {
    
    var updateContentTimer;

    function updateContent(args, eventName) {
        var updateContentText = "<br /><div>Content has been updated on the " + eventName + " event.</div><br />"; 
        if(updateContentTimer)
            clearTimeout(updateContentTimer);     
        updateContentTimer = setTimeout(function() {            
            viewModel.content((eventName == "PullDown" ?  updateContentText + viewModel.content() : viewModel.content() +  updateContentText));
            args.component.release();
        }, 500);        
    }

    var updateBottomContent = function(e) {
        updateContent(e, "ReachBottom");
    };
    
    var viewModel = {
        content : ko.observable(longText),
        
        updateTopContent: function(e) {
            updateContent(e, "PullDown");
        },
        updateBottomContent: ko.observable(updateBottomContent),
        
        showScrollbarModes : [{
                text: "On Scroll",
                value: "onScroll"
            }, {
                text: "On Hover",
                value: "onHover"
            }, {
               text: "Always",
               value: "always"
            }, {
               text: "Never",
               value: "never"
        }],
        
        showScrollbarMode : ko.observable("onScroll"),
        scrollByContentValue : ko.observable(true),
        scrollByThumbValue : ko.observable(true),
        reachBottomValue : ko.observable(true),
        pullDownValue : ko.observable(false)
    };
    
    viewModel.reachBottomValue.subscribe(function(value){
        if(value){
            viewModel.updateBottomContent(updateBottomContent);
        } else {
            viewModel.updateBottomContent(null);  
        }
    });
    
    ko.applyBindings(viewModel, document.getElementById("container"));
};