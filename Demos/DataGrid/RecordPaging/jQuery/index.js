$(function(){
    const dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: generateData(10000),
        showBorders: true,
        scrolling: { 
            rowRenderingMode: 'virtual'
        },
        paging: {
            pageSize: 10
        },
        pager: {
            visible: true,
            allowedPageSizes: [5, 10, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true
        }
    }).dxDataGrid("instance");

    $("#displayMode").dxSelectBox({
        items: ["full", "compact"],
        value: "full",
        onValueChanged: function(data) {
            dataGrid.option("pager.displayMode", data.value);
            pageInfo.option("disabled", data.value === "compact");
            navButtons.option("disabled", data.value === "compact");
        }
    });
    $("#showPageSizes").dxCheckBox({
        text: "Show Page Size Selector",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("pager.showPageSizeSelector", data.value);
        }
    });
    const pageInfo = $("#showInfo").dxCheckBox({
        text: "Show Info Text",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("pager.showInfo", data.value);
        }
    }).dxCheckBox("instance");
    const navButtons = $("#showNavButtons").dxCheckBox({
        text: "Show Navigation Buttons",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("pager.showNavigationButtons", data.value);
        }
    }).dxCheckBox("instance");
});