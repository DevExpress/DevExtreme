window.onload = function() {
    var viewModel = function(){
        var that = this;
        
        that.selectedIndex = ko.observable(0);
        that.animationEnabled = ko.observable(true);
        that.swipeEnabled = ko.observable(true);
        that.loop = ko.observable(false);
        that.itemCount = tabPanelItems.length;
        
        that.tabPanelOptions = {
            height: 260,
            dataSource: tabPanelItems,
            selectedIndex: that.selectedIndex,
            loop: that.loop,
            animationEnabled: that.animationEnabled,
            swipeEnabled: that.swipeEnabled,
            itemTitleTemplate: "title",
            itemTemplate: "customer",
            
        };
        
    };
    
    ko.applyBindings(new viewModel(), document.getElementById("tabpanel"));
};