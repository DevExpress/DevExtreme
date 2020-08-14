$(function(){
    $("#sales").dxPivotGrid({
        height: 440,
        rowHeaderLayout: 'tree',
        showBorders: true,
        fieldChooser: {
            enabled: false
        },
        export: {
            enabled: true
        },
        dataSource: {
            fields: [{
                caption: "Region",
                dataField: "region",
                area: "row",
                expanded: true
            }, {
                caption: "City",
                dataField: "city",
                area: "row",
                width: 150
            }, {
                dataField: "date",
                dataType: "date",
                area: "column",
                expanded: true
            }, {
                caption: "Sales",
                dataField: "amount",
                dataType: "number",
                area: "data",
                summaryType: "sum",
                format: "currency",
            }],
            store: sales
        },
        onExporting: function(e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Sales');
            
            DevExpress.excelExporter.exportPivotGrid({
                component: e.component,
                worksheet: worksheet
            }).then(function() {
                workbook.xlsx.writeBuffer().then(function(buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
                });
            });
            e.cancel = true;
        }
    });
});