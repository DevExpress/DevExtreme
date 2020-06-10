window.onload = function() {
    var resizingModes = ["nextColumn", "widget"],
        columnResizingMode = ko.observable(resizingModes[0]);

    var viewModel = {
        dataGridOptions: {
            dataSource: customers,
            allowColumnResizing: true,
            showBorders: true,
            columnResizingMode: columnResizingMode,
            columnMinWidth: 50,
            columnAutoWidth: true,
            columns: ["CompanyName", "City", "State", "Phone", "Fax"]
        },
        resizingOptions: {
            items: resizingModes,
            value: columnResizingMode,
            width: 250,
            onValueChanged: function(data) {
                columnResizingMode(data.value);    
            }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("dataGrid"));
};