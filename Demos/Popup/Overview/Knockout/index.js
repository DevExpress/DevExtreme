window.onload = function() {
    var viewModel = function() {
        var that = this;

        that.employees = ko.observableArray(employees);
        that.employee = ko.observable({});
        that.visiblePopup = ko.observable(false);

        that.popupOptions = {
            width: 300,
            height: 250,
            contentTemplate: "info",
            showTitle: true,
            title: "Information",
            visible: that.visiblePopup,
            dragEnabled: false,
            closeOnOutsideClick: true
        };

        that.showInfo = function (data) {
            that.employee(data.model);
            that.visiblePopup(true);
        };
    };

    ko.applyBindings(new viewModel(), document.getElementById("container"));
};