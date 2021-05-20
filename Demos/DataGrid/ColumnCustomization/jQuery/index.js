$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showBorders: true,
        columnChooser: {
            enabled: true
        },
        columnFixing: { 
            enabled: true
        },
        columns: [{
            caption: "Employee",
            width: 230,
            fixed: true,
            calculateCellValue: function(data) {
                return [data.Title,
                    data.FirstName, data.LastName]
                    .join(" ");
            }
        }, {
            dataField: "BirthDate",
            dataType: "date"
        }, {
            dataField: "HireDate",
            dataType: "date"
        }, {
            dataField: "Position",
            alignment: "right",
        }, { 
            dataField: "Address",
            width: 230,
        }, "City", "State", {
            dataField: "Zipcode",
            visible: false
        }, "HomePhone", "MobilePhone", "Skype", "Email"]
    });
});