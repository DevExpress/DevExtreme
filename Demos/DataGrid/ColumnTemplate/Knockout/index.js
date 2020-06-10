window.onload = function() {
    var viewModel = {
        dataGridOptions: {
            dataSource: employees,
            showBorders: true,
            columns: [{
                    dataField: "Picture",
                    width: 100,
                    allowFiltering: false,
                   allowSorting: false,
                    cellTemplate: "cellTemplate"
                }, {
                    dataField: "Prefix",
                    caption: "Title",
                    width: 70
                },
                "FirstName",
                "LastName",
                "Position", {
                    dataField: "BirthDate",
                    dataType: "date"
                }, {
                    dataField: "HireDate",
                    dataType: "date"
                }
            ]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};