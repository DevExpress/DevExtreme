$(function(){
    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        filterMode: "matchOnly",
        columns: [
            {
                dataField: "Title",
                caption: "Position",
                dataType: "string"
            }, {
                dataField: "Full_Name",
                dataType: "string"
            }, {
                dataField: "City",
                dataType: "string"
            }, {
                dataField: "State",
                dataType: "string"
            }, {
                dataField: "Mobile_Phone",
                dataType: "string"
            }, {
                dataField: "Hire_Date",
                dataType: "date"
            }
        ],
        searchPanel: {
            visible: true,
            text: "Manager"
        },
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true
    }).dxTreeList("instance");

    $("#filterMode").dxSelectBox({
        value: "matchOnly",
        items: ["matchOnly", "withAncestors", "fullBranch"],
        onValueChanged: function (data) {
            treeList.option("filterMode", data.value);
        }
    });
});