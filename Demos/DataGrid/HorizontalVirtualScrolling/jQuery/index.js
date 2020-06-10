$(function() {
	var columnCount = 500,
        rowCount = 50;
    
    $("#grid").dxDataGrid({
        dataSource: generateData(rowCount, columnCount),
        columnWidth: 100,
        showBorders: true,
        scrolling: {
            columnRenderingMode: "virtual"
        },
        paging: {
            enabled: false
        }
    });
});
