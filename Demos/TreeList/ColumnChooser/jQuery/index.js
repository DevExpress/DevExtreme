$(function(){
    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        columns: [{
                dataField: "Title",
                caption: "Position"
            }, {
                dataField: "Full_Name",
                allowHiding: false
            }, "City", "State", "Mobile_Phone", {
                dataField: "Email",
                visible: false
            }, {
                dataField: "Hire_Date",
                dataType: "date"
            }, {
                dataField: "Skype",
                visible: false
            }],
        columnAutoWidth: true,
        showRowLines: true,
        showBorders: true,
        columnChooser: {
            enabled: true,
            allowSearch: true
        },
        expandedRowKeys: [1]
    }).dxTreeList("instance");

    var columnChooserModes = [{
        key: "dragAndDrop",
        name: "Drag and drop"
    }, {
        key: "select",
        name: "Select"
    }];

    $("#columnChooserMode").dxSelectBox({
        items: columnChooserModes,
        value: columnChooserModes[0].key,
        valueExpr: "key",
        displayExpr: "name",
        onValueChanged: function(data) {
            treeList.option("columnChooser.mode", data.value);
        }
    });
    
    $("#allowSearch").dxCheckBox({
        text: "Allow search",
        value: true,
        onValueChanged: function(data) {
            treeList.option("columnChooser.allowSearch", data.value);
        }
    });
});