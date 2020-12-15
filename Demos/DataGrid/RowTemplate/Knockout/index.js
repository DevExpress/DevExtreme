var formatDate = new Intl.DateTimeFormat("en-US").format;

window.onload = function() {
    var viewModel = {
        dataGridOptions: {
            dataSource: employees,
            rowTemplate: $("#gridRow"),
            columnAutoWidth: true,
            showBorders: true,
            columns: [{
                    caption: "Photo",
                    width: 100,
                    allowFiltering: false,
                    allowSorting: false
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