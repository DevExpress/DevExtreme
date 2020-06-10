window.onload = function() {
    var selectedItems = ko.observableArray([]),
        deleteType = ko.observable("toggle"),
        allowEditing = ko.observable(false);

    var viewModel = {
        listOptions: {
            dataSource: tasks,
            height: 400,
            allowItemDeleting: allowEditing,
            itemDeleteMode: deleteType,
            showSelectionControls: true,
            selectionMode: "multiple",
            selectedItems: selectedItems
        },
        deleteTypeOptions: {
            dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
            disabled: ko.computed(function() {
                return !allowEditing();
            }),
            value: deleteType
        },
        allowEditingOptions: {
            value: allowEditing,
            text: "Allow deleting"
        },
        selectedItems: selectedItems
    };

    ko.applyBindings(viewModel, document.getElementById("list-api-demo"));
};