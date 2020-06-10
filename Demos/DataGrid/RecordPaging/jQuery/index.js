$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: customers,
        showBorders: true,
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20],
            showInfo: true
        },
        columns: ["CompanyName", "City", "State", "Phone", "Fax"]
    });
    
});