window.onload = function() {
    var viewModel = {
        lookupOptions: {
            dropDownOptions: {
                showTitle: false
            },
            items: employeesList,
            value: employeesList[0]
        },
    
        lookupGroupedOptions: {
            dataSource: new DevExpress.data.DataSource({ 
                store: employeesTasks, 
                key: "ID", 
                group: "Assigned"
            }),
            dropDownOptions: {
                closeOnOutsideClick: true,
                showTitle: false
            },
            grouped: true,
            displayExpr: "Subject"
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};