$(function() {
    let selectionMode = "all";
    
    function getEmployeeNames(employees) {
        if (employees.length > 0) {
            return employees.map(employee => employee.Full_Name).join(", ");
        } else {
            return "Nobody has been selected";
        }
    }

    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        selection: {
            mode: "multiple",
            recursive: false
        },
        columns: [{ 
                dataField: "Full_Name"
            }, {
                dataField: "Title",
                caption: "Position"
            }, "City", "State",
            {
                dataField: "Hire_Date",
                dataType: "date",
                width: 120
            }
        ],
        expandedRowKeys: [1, 2, 10],
        onSelectionChanged: function(selectedItems) {
            var selectedData = treeList.getSelectedRowsData(selectionMode);
            $("#selected-items-container").text(getEmployeeNames(selectedData));
        }
    }).dxTreeList("instance");

    $("#recursive").dxCheckBox({
        value: false,
        text: "Recursive Selection",
        onValueChanged: function(e) {
            treeList.clearSelection();
            treeList.option("selection.recursive", e.value);
        }
    });
    
    $("#selection-mode").dxSelectBox({
        value: selectionMode,
        items: ["all", "excludeRecursive", "leavesOnly"],
        onValueChanged: function({ value }) {
            treeList.clearSelection();
            selectionMode = value;
        }
    });
});