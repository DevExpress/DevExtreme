$(function() {
    var updateSelectedItems = function(e) {
        var selectedItems = e.component.option("selectedItems");
        $("#selectedItems").text(selectedItems.join(", "));
    };

    var listWidget = $("#simpleList").dxList({
        dataSource: tasks,
        height: 400,
        allowItemDeleting: false,
        itemDeleteMode: "toggle",
        showSelectionControls: true,
        selectionMode: "multiple",
        onSelectionChanged: updateSelectedItems,
        onItemDeleted: updateSelectedItems
    }).dxList("instance");

    $("#allowEditing").dxCheckBox({
        value: false,
        text: "Allow deleting",
        onValueChanged: function(data) {
            listWidget.option("allowItemDeleting", data.value);
            deleteTypeChooser.option("disabled", !data.value);
        }
    });

    var deleteTypeChooser = $("#deleteType").dxSelectBox({
        disabled: true,
        dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
        value: "toggle",
        onValueChanged: function(data) {
            listWidget.option("itemDeleteMode", data.value);
        }
    }).dxSelectBox("instance");
});