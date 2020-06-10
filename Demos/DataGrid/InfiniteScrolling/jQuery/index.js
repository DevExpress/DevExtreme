$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: generateData(100000),
        showBorders: true,
        customizeColumns: function (columns) {
            columns[0].width = 70;
        },
        loadPanel: {
            enabled: false
        },
        scrolling: {
            mode: 'infinite'
        },
        sorting: {
            mode: "none"
        }
    });
    
});