$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        selection: {
            mode: "single"
        },
        hoverStateEnabled: true,
        showBorders: true,
        columns: [{
            dataField: "Prefix",
            caption: "Title",
            width: 70
        }, 
        "FirstName",
        "LastName", {
            dataField: "Position",
            width: 180
        }, {
            dataField: "BirthDate",
            dataType: "date"
        }, {
            dataField: "HireDate",
            dataType: "date"
        }],
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData[0];
            if(data) {
                $(".employeeNotes").text(data.Notes);
                $(".employeePhoto").attr("src", data.Picture);
            }
        }
    });
});