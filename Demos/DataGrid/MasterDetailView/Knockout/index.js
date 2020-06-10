window.onload = function() {
    var viewModel = {
    	gridOptions: {
    	    dataSource: employees,
			keyExpr: "ID",
			showBorders: true,
    	    columns: [{
    	            dataField: "Prefix",
    	            caption: "Title",
    	            width: 70
    	        },
    	        "FirstName",
    	        "LastName", {
    	            dataField: "Position",
    	            width: 170
    	        }, {
    	            dataField: "State",
    	            width: 125
    	        }, {
    	            dataField: "BirthDate",
    	            dataType: "date"
    	        }
    	    ],
    	    masterDetail: {
    	        enabled: true,
    	        template: "detail"
    	    }
    	},
    	completedValue: function(rowData) {
    		return rowData.Status == "Completed";
    	}
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};