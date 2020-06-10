window.onload = function() {
    var viewModel = function(){
        var that = this;
    
        that.employee = ko.observable({});
        that.loadingVisible = ko.observable(false);
        that.closeOnOutsideClick = ko.observable(false);
        that.showIndicator = ko.observable(true);
        that.showPane = ko.observable(true);
        that.shading = ko.observable(true);
        
        that.loadOptions = {
            visible: that.loadingVisible,
            showIndicator: that.showIndicator,
            showPane: that.showPane,                
            shading: that.shading,
            closeOnOutsideClick: that.closeOnOutsideClick, 
            shadingColor: "rgba(0,0,0,0.4)",
            position: { of: "#employee" },        
            onShown: function(){
                setTimeout(function () { 
                    that.loadingVisible(false); 
                }, 3000);
            },
            onHidden: function(){
                that.employee(employee);
            }
        };
    
        that.showLoadPanel = function(){
            that.employee({});
            that.loadingVisible(true); 
        };
        
    };
    
    ko.applyBindings(new viewModel(), document.getElementById("container"));
};