window.onload = function() {
    var viewModel = {
        boxOptions1: {
            direction: "row", 
            width: "100%", 
            height: 75
        },
        boxOptions2: {
            direction: "row", 
            width: "100%", 
            height: 75, 
            align: "center", 
            crossAlign: "center"
        },
        boxOptions3: {
            direction: "col", 
            width: "100%", 
            height: 250
        },
        boxOptions4: {
            direction: "row", 
            width: "100%", 
            height: 125
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("container"));
};