window.onload = function() {
    var viewModel = {
            dataGridOptions: {
                dataSource: "../../../../data/customers.json",
                columns: ["CompanyName", "City", "State", "Phone", "Fax"],
                showBorders: true
            }
        };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};