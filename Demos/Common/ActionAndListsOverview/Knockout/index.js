window.onload = function() {
    var currentHotel = ko.observable(data[0]);

    var viewModel = {
        dataSource: dataSource,
        currentHotel: currentHotel,
        listSelectionChanged: function(e) {
            currentHotel(e.addedItems[0]);
        }
    };

    ko.applyBindings(viewModel, document.getElementById("overview"));
};
