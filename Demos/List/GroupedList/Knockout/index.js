window.onload = function() {
    var viewModel = {
        listOptions: {
            dataSource: employees,
            height: "100%",
            grouped: true,
            collapsibleGroups: true,
            groupTemplate: function(data) {
                return $("<div>Assigned: " + data.key + "</div>");
    
            }
        } 
    };
    
    ko.applyBindings(viewModel, document.getElementById("list"));
};