$(function(){
    $("#data-grid").dxDataGrid({
        dataSource: employees,
        columns: ["FirstName", "LastName", "BirthYear", "City", "Title"],
        showBorders: true,
        columnAutoWidth: true
    });
    
    $("#range-selector").dxRangeSelector({
        margin: {
            top: 20
        },
        dataSource: employees,
        dataSourceField: "BirthYear",
        scale: {
            tickInterval: 1,
            minorTickInterval: 1,
            label: {
                format: {
                    type: "decimal"
                }
            }
        },
        behavior: {
            callValueChanged: "onMoving"
        },
        title: "Filter Employee List by Birth Year",
        onValueChanged: function (e) {
            var selectedEmployees = $.grep(employees, function(employee) {
                return employee.BirthYear >= e.value[0] && employee.BirthYear <= e.value[1];
            });
            $("#data-grid").dxDataGrid({
                dataSource: selectedEmployees
            });
        }
    });
});