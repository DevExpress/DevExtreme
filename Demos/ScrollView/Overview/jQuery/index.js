$(function(){
    $("#scrollview-content").html(longText);

    function updateContent(args, eventName) {
        setTimeout(function() {
            $("<br /><div>Content has been updated on the " + eventName + " event.</div><br />")[eventName == "PullDown" ? "prependTo" : "appendTo"]("#scrollview-content");
            args.component.release();
        }, 500);
    }
    
    function updateBottomContent(e) {
        updateContent(e, "ReachBottom");
    }
    
    function updateTopContent(e) {
         updateContent(e, "PullDown");
    }
    
    var scrollViewWidget = $("#scrollview").dxScrollView({
        scrollByContent: true,
        scrollByThumb: true,
        showScrollbar: "onScroll",
        onReachBottom: updateBottomContent,
        reachBottomText: "Updating..."
    }).dxScrollView("instance");
    
    var showScrollbarModes = [{
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
    }];
    
    $("#show-scrollbar-mode").dxSelectBox({
        items: showScrollbarModes,
        value: showScrollbarModes[0].value,
        valueExpr: "value",
        displayExpr: "text",
        onValueChanged: function(data) {
            scrollViewWidget.option("showScrollbar", data.value);
        }
    });
    
    $("#use-reach-bottom").dxCheckBox({
        value: true,
        text: "Update content on the ReachBottom event",
        onValueChanged: function(data) {
            scrollViewWidget.option("onReachBottom", data.value ? updateBottomContent : null);
        }
    });
    
    $("#use-pull-down-bottom").dxCheckBox({
        value: false,
        text: "Update content on the PullDown event",
        onValueChanged: function(data) {
            scrollViewWidget.option("onPullDown", data.value ? updateTopContent : null);
            scrollViewWidget.option("bounceEnabled", data.value);
        }
    });
    
    $("#scroll-by-content").dxCheckBox({
        value: true,
        text: "Scroll by content",
        onValueChanged: function(data) {
            scrollViewWidget.option("scrollByContent", data.value);
        }
    });
    
    $("#scroll-by-thumb").dxCheckBox({
        value: true,
        text: "Scroll by thumb",
        onValueChanged: function(data) {
            scrollViewWidget.option("scrollByThumb", data.value);
        }
    });
});