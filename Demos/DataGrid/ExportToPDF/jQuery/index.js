$(function(){
    $('#btn').dxButton({
        text: 'Export to PDF',
        onClick: function() {
            var headRow = [['Prefix', 'FirstName', 'LastName', 'City', 'State', 'Position', 'BirthDate', 'HireDate']];
            var bodyRows = [];
            $.map(employees, function(val, i) {
                bodyRows.push([val.FirstName, val.LastName, val.Prefix, val.City, val.State, val.Position, val.BirthDate, val.HireDate]);
            });
            
            var autoTableOptions = {
                theme: 'plain',
                tableLineColor: 149,
                tableLineWidth: 0.1,
                styles: { textColor: 51, lineColor: 149, lineWidth: 0 },
                columnStyles: {},
                headStyles: { fontStyle: 'normal', textColor: 149, lineWidth: 0.1 },
                bodyStyles: { lineWidth: 0.1 },
                head: headRow,
                body: bodyRows
            };

            var doc = new jsPDF('p', 'pt', 'a4');
            doc.autoTable(autoTableOptions);
            doc.save("filePDF.pdf");
        }
    });

    $("#gridContainer").dxDataGrid({
        dataSource: employees,
        showBorders: true,
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 60
            },
            "FirstName",
            "LastName", 
            "City",
            "State",
            {
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
    });
});