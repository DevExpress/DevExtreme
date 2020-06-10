window.onload = function() {
    var viewModel = {
        dataGridOptions: {
            dataSource: customers,
            columns: ["CompanyName", "City", "State", "Phone", "Fax"],
            showBorders: true
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};