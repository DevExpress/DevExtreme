window.onload = function() {
    var viewModel = {
    	pivotGridOptions: {
    	    allowSortingBySummary: true,
    	    allowSorting: true,
    	    allowFiltering: true,
    	    allowExpandAll: true,
    		showBorders: true,
    	    height: 560,
    	    fieldChooser: {
    		    enabled: false 
    	    },
    	    scrolling: {
    	        mode: "virtual"
    	    }, 
    	    dataSource: {
    	        fields: [{
    	            caption: "Region",
    	            width: 120,
    	            dataField: "region",
    	            area: "row",
    	            expanded: true 
    	        }, {
    	            caption: "City",
    	            dataField: "city",
    	            width: 150,
    	            area: "row"
    	        }, {
    	            dataField: "date",
    	            dataType: "date",
    	            area: "column"
    	        }, {
    	            groupName: "date",
    	            groupInterval: "year",
    	            expanded: true
    	        },  {
    	            groupName: "date",
    	            groupInterval: "quarter",
    	            expanded: true
    	        }, {
    	            caption: "Total",
    	            dataField: "amount",
    	            dataType: "number",
    	            summaryType: "sum",
    	            format: "currency",
    	            area: "data"
    	        }],
    	        store: sales
        	}
    	}
    };
    
    ko.applyBindings(viewModel, document.getElementById("pivotgrid"));
};