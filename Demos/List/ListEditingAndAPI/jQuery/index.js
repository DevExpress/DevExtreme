$(function() {
    var listWidget = $("#simpleList").dxList({
        dataSource: tasks,
        height: 400,
        allowItemDeleting: false,
        itemDeleteMode: "toggle",
    }).dxList("instance");

    $("#allowDeletion").dxCheckBox({
        value: false,
        text: "Allow deletion",
        onValueChanged: function(data) {
            listWidget.option("allowItemDeleting", data.value);
            itemDeleteModeChooser.option("disabled", !data.value);
        }
    });

    var itemDeleteModeChooser = $("#itemDeleteMode").dxSelectBox({
        disabled: true,
        dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
        value: "toggle",
        onValueChanged: function(data) {
            listWidget.option("itemDeleteMode", data.value);
        }
    }).dxSelectBox("instance");
});