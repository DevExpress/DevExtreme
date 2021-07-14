window.onload = function() {
    var itemDeleteMode = ko.observable("toggle"),
        allowDeletion = ko.observable(false);

    var viewModel = {
        listOptions: {
            dataSource: tasks,
            height: 400,
            allowItemDeleting: allowDeletion,
            itemDeleteMode: itemDeleteMode,
        },
        itemDeleteModeOptions: {
            dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
            disabled: ko.computed(function() {
                return !allowDeletion();
            }),
            value: itemDeleteMode
        },
        allowDeletionOptions: {
            value: allowDeletion,
            text: "Allow deletion"
        }
    };

    ko.applyBindings(viewModel, document.getElementById("list-api-demo"));
};