window.onload = function() {
    var viewModel = {
        actionSheetOptions: {
            dataSource: actionSheetItems,
            title: "Choose action",
            visible: ko.observable(false),
            showTitle: ko.observable(true),
            showCancelButton: ko.observable(true),
            onCancelClick: function() {
                showNotify("Cancel");
            },
            onItemClick: function(value) {
                showNotify(value.itemData.text);
            }   
        },
    
        buttonOptions: {
            text: "Click to show Action Sheet",
            onClick: function(e) {
                e.model.actionSheetOptions.visible(true);
            }
        },        
    };
    
    function showNotify(value) {    
        DevExpress.ui.notify("The \"" + value + "\" button is clicked.");
    }
    
    ko.applyBindings(viewModel, document.getElementById("demo"));
};