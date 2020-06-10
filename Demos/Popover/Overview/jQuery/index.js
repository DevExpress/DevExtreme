$(function(){
    $("#popover1").dxPopover({
        target: "#link1",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "top",
        width: 300
    });
    
    $("#popover2").dxPopover({
        target: "#link2",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "bottom",
        width: 300,
        showTitle: true,
        title: "Details:"
    });
    
    $("#popover3").dxPopover({
        target: "#link3",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "top",
        width: 300,
        animation: { 
            show: {
                type: "pop",
                from: {  scale: 0 },
                to: { scale: 1 }
            },
            hide: {
                type: "fade",
                from: 1,
                to: 0
            }
        }
    });
    
    $("#popover4").dxPopover({
        target: "#link4",
        showEvent: "dxclick",
        position: "top",
        width: 300,
        shading: true,
        shadingColor: "rgba(0, 0, 0, 0.5)"
    });
});