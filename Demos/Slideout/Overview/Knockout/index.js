window.onload = function() {
    function viewModel() {
        var that = this;
        that.swipeValue = ko.observable(true);
        that.menuVisible = ko.observable(true);
        that.products = products;
        that.toolbarItems = [{ 
            location: "before",
            widget: "dxButton",
            options: {
                icon: "menu",
                onClick: function () { that.showMenu(); }
            }
        }, { 
            location: "center",
            template: "title"
        }];
        that.showMenu = function (e) {
            that.menuVisible(!that.menuVisible());
        };
    }
    ko.applyBindings(new viewModel(), document.getElementById("slideout"));
};