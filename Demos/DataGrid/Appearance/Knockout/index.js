window.onload = function() {
    var showColumnLines = ko.observable(false),
        showRowLines = ko.observable(true),
        showBorders = ko.observable(true),
        rowAlternationEnabled = ko.observable(true);
    
    var viewModel = {
        dataGridOptions: {
            dataSource: employees,
            showColumnLines: showColumnLines,
            showRowLines: showRowLines,
            showBorders: showBorders,
            rowAlternationEnabled: rowAlternationEnabled,
            columns: [
                {
                    dataField: "Prefix",
                    caption: "Title",
                    width: 80
                },
                "FirstName",
                "LastName", 
                {
                    dataField: "City",
                }, {
                    dataField: "State",
                }, {
                    dataField: "Position",
                    width: 130
                }, {
                  dataField: "BirthDate",
                  dataType: "date",
                  width: 100
                }, {
                  dataField: "HireDate",
                  dataType: "date",
                  width: 100
                }
            ]
        },
        columnLinesOptions: {
            text: "Show Column Lines",
            value: showColumnLines
        },
        rowLinesOptions: {
            text: "Show Row Lines",
            value: showRowLines
        },
        showBordersOptions: {
            text: "Show Borders",
            value: showBorders
        },
        rowAlternationOptions: {
            text: "Alternating Row Color",
            value: rowAlternationEnabled
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};