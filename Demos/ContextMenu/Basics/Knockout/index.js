window.onload = function() {
    var viewModel = {
        contextMenuOptions: {
            dataSource: contextMenuItems,
            width: 200,
            target: "#image",
    	    onItemClick: function(e){
    	    	if (!e.itemData.items) {
    	        	DevExpress.ui.notify("The \"" + e.itemData.text + "\" item was clicked", "success", 1500);
    	        }
    	    }
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};