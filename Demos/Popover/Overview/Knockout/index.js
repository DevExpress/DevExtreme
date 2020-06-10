window.onload = function() {
    var viewModel = {
        defaultOptions: {
            target: "#link1",
            showEvent: "dxhoverstart",
            hideEvent: "dxhoverend",
            position: "top",
            width: 300,
            visible: false
        },
        withTitleOptions: {
            target: "#link2",
            showEvent: "dxhoverstart",
            hideEvent: "dxhoverend",
            position: "bottom",
            width: 300,
            showTitle: true,
            title: "Details:",
            visible: false
        },
        withAnimationOptions: {
            target: "#link3",
            showEvent: "dxhoverstart",
            hideEvent: "dxhoverend",
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
            },
            visible: false
        },
        withShadingOptions: {
            target: "#link4",
            showEvent: "dxclick",
            position: "top",
            width: 300,
            shading: true,
            shadingColor: "rgba(0, 0, 0, 0.5)",
            visible: false
        }
    }; 
    
    ko.applyBindings(viewModel, document.getElementById("popover"));
};