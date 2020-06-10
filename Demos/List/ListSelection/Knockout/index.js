window.onload = function() {
    var selectedItemKeys = ko.observable([]),
        selectionMode = ko.observable("all"),
        selectAllMode = ko.observable("page");  
    
    var viewModel = {
        listOptions: {
            dataSource: new DevExpress.data.DataSource({
                store: new DevExpress.data.ArrayStore({
                    key: "id",
                    data: tasks
                })
            }),
            height: 400,
            showSelectionControls: true,
            selectionMode: selectionMode,
            selectAllMode: selectAllMode,
            selectedItemKeys: selectedItemKeys
        },
        selectAllModeOptions: {
            items: ["page", "allPages"],
            disabled: ko.computed(function() {
                return selectionMode() !== "all";
            }),
            value: selectAllMode
        },
        selectionModeOptions: {
            items: ["none", "single", "multiple", "all"],
            value: selectionMode
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("list-demo"));
};