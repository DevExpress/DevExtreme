$(function(){
    var dataGrid = $("#grid-container").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 80
            },
            "FirstName",
            "LastName",
            {
                dataField: "City",
            }, {
                dataField: "State",
            }, {
                dataField: "Position",
                width: 130
            }, {
              dataField: "BirthDate",
              dataType: "date",
              width: 100
            }, {
              dataField: "HireDate",
              dataType: "date",
              width: 100
            }
        ]
    }).dxDataGrid("instance");
    
    $("#column-lines").dxCheckBox({
        text: "Show Column Lines",
        value: false,
        onValueChanged: function(data) {
            dataGrid.option("showColumnLines", data.value);
        }
    });
    
    $("#row-lines").dxCheckBox({
        text: "Show Row Lines",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("showRowLines", data.value);
        }
    });
    
    $("#show-borders").dxCheckBox({
        text: "Show Borders",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("showBorders", data.value);
        }
    });
    
    $("#row-alternation").dxCheckBox({
        text: "Alternating Row Color",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("rowAlternationEnabled", data.value);
        }
    });
});