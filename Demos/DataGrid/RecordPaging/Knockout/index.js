window.onload = function() {
    var viewModel = {
        dataGridOptions: {
            dataSource: customers,
            showBorders: true,
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                showInfo: true
            },
            columns: ["CompanyName", "City", "State", "Phone", "Fax"]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};