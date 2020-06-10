window.onload = function() {
    var viewModelLongTabs = function(){
        var that = this;
        that.tabOptions = {
            dataSource: longtabs
        };
    };
    ko.applyBindings(new viewModelLongTabs(), document.getElementById("longtabs"));
    
    
    
    var viewModelScrolledTabs = function(){
        var that = this;
        that.tabOptions = {
            dataSource: longtabs,
            width: 300,
            scrollByContent: true,
            showNavButtons: true
        };
    };
    ko.applyBindings(new viewModelScrolledTabs(), document.getElementById("scrolledtabs"));
    
    
    
    var viewModel = function(){
        var that = this;
        that.tabContent = ko.observable();
        that.selectedTab = ko.observable(0);
        that.tabOptions = {
            dataSource: tabs,
            selectedIndex: that.selectedTab
        };
        that.selectBoxOptions = {
            value: that.selectedTab,
            dataSource: tabs, 
            displayExpr: "text",
            valueExpr: "id"
        };
        ko.computed(function () {
            that.tabContent(tabs[that.selectedTab()].content);
        });
    };
    ko.applyBindings(new viewModel(), document.getElementById("tabs"));
    
    
};