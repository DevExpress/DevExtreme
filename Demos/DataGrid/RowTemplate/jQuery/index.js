$(function(){
    var formatDate = new Intl.DateTimeFormat("en-US").format;

    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        rowTemplate: function(container, item) {
            var data = item.data,
                markup = "<tbody class='employee dx-row " + ((item.rowIndex % 2) ? 'dx-row-alt' : '') + "'>" +
                    "<tr class='main-row'>" +
                    "<td rowspan='2'><img src='" + data.Picture + "' /></td>" +
                    "<td>" + data.Prefix + "</td>" +
                    "<td>" + data.FirstName + "</td>" +
                    "<td>" + data.LastName + "</td>" +
                    "<td>" + data.Position + "</td>" +
                    "<td>" + formatDate(new Date(data.BirthDate)) + "</td>" +
                    "<td>" + formatDate(new Date(data.HireDate)) + "</td>" +
                "</tr>" +
                "<tr class='notes-row'>" +
                    "<td colspan='6'><div>" + data.Notes + "</div></td>" +
                "</tr>" +
            "</tbody>";
    
            container.append(markup);
        },
        columnAutoWidth: true,
        showBorders: true,
        columns: [{
                caption: "Photo",
                width: 100,
                allowFiltering: false,
                allowSorting: false
            }, {
                dataField: "Prefix",
                caption: "Title",
                width: 70
            },
            "FirstName",
            "LastName", 
            "Position", {
                dataField: "BirthDate",
                dataType: "date"
            }, {
                dataField: "HireDate",
                dataType: "date"
            }
        ]
    });
    
});