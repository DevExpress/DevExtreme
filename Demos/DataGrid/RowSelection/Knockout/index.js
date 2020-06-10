window.onload = function() {
    var selectedEmployee = ko.observable({});
    
    var viewModel = {
    	selectedEmployee: selectedEmployee,
    	gridOptions: {
    	    dataSource: employees,
			keyExpr: "ID",
    	    selection: {
    	        mode: "single"
    	    },
			hoverStateEnabled: true,
			showBorders: true,
    	    columns: [{
    	        dataField: "Prefix",
    	        caption: "Title",
    	        width: 70
    	    }, 
    	    "FirstName",
    	    "LastName", {
    	        dataField: "Position",
    	        width: 180
    	    }, {
    	        dataField: "BirthDate",
    	        dataType: "date"
    	    }, {
    	        dataField: "HireDate",
    	        dataType: "date"
    	    }],
    	    onSelectionChanged: function (selectedItems) {
    	    	selectedEmployee(selectedItems.selectedRowsData[0]);
    	    }
    	}
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};