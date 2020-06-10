window.onload = function() {
    var viewModel = function(){
        var that = this;
    
        that.selectedIndex = ko.observable(0);
        that.animationEnabled = ko.observable(true);
        that.loop = ko.observable(false);
        that.itemCount = multiViewItems.length;
    
        that.multiViewOptions = {
            height: 300,
            dataSource: multiViewItems,
            selectedIndex: that.selectedIndex,
            loop: that.loop,
            animationEnabled: that.animationEnabled,
            itemTemplate: "customer"
        };
    
    };
    
    ko.applyBindings(new viewModel(), document.getElementById("multiview"));
};