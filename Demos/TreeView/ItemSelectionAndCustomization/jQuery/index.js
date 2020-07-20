$(function(){
    var selectedEmployeesList = $("#selected-employees").dxList({
        width: 400,
        height: 200,
        showScrollbar: "always",
        itemTemplate: function(item) {
            return "<div>" + item.prefix + " " + item.fullName + " (" + item.position + ")</div>";
        }
    }).dxList("instance");

    var treeView = $("#treeview").dxTreeView({ 
        items: employees,
        width: 340,
        height: 320,
        showCheckBoxesMode: "normal",
        onSelectionChanged: function(e) {
            syncSelection(e.component);
        },
        onContentReady: function(e) {
            syncSelection(e.component);
        },
        itemTemplate: function(item) {
            return "<div>" + item.fullName + " (" + item.position + ")</div>";
        }
    }).dxTreeView('instance');

    function syncSelection(treeView){
        var selectedEmployees = treeView.getSelectedNodes()
            .map(function(node) { return node.itemData; });

        selectedEmployeesList.option("items", selectedEmployees);
    }

    $("#showCheckBoxesMode").dxSelectBox({
        items: ["selectAll", "normal", "none"],
        value: "normal",
        onValueChanged: function(e) {
            treeView.option("showCheckBoxesMode", e.value);

            if(e.value === 'selectAll') {
                selectionModeSelectBox.option('value', 'multiple');
                recursiveCheckBox.option('disabled', false);
            }
            selectionModeSelectBox.option('disabled', e.value === 'selectAll');
        }
    });   

    var selectionModeSelectBox = $("#selectionMode").dxSelectBox({
        items: ["multiple", "single"],
        value: "multiple",
        onValueChanged: function(e) {
            treeView.option("selectionMode", e.value);

            if(e.value === 'single') {
                recursiveCheckBox.option('value', false);
                treeView.unselectAll();
            }

            recursiveCheckBox.option('disabled', e.value === 'single');
        }
    }).dxSelectBox('instance');

    var recursiveCheckBox = $("#selectNodesRecursive").dxCheckBox({
        text: "Select Nodes Recursive",
        value: true,
        onValueChanged: function(e) {
            treeView.option("selectNodesRecursive", e.value);
        }
    }).dxCheckBox('instance');
    
    $("#selectByClick").dxCheckBox({
        text: "Select By Click",
        value: false,
        onValueChanged: function(e) {
            treeView.option("selectByClick", e.value);
        }
    });    
});