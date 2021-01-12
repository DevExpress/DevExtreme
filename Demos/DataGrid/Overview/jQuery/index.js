$(function() {
    $("#gridContainer").dxDataGrid({
        dataSource: {
            store: {
                type: "odata",
                url: "https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes",
                beforeSend: function(request) {
                    request.params.startDate = "2020-05-10";
                    request.params.endDate = "2020-05-15";
                }
            }
        },
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50, 100]
        },
        remoteOperations: false,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true
        },
        groupPanel: { visible: true },
        grouping: {
            autoExpandAll: false
        },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        columns: [
            {
                dataField: "Product",
                groupIndex: 0
            },
            {
                dataField: "Amount",
                caption: "Sale Amount",
                dataType: "number",
                format: "currency",
                alignment: "right",
            },
            {
                dataField: "Discount",
                caption: "Discount %",
                dataType: "number",
                format: "percent",
                alignment: "right",
                allowGrouping: false,
                cellTemplate: discountCellTemplate,
                cssClass: "bullet"
            },
            {
                dataField: "SaleDate",
                dataType: "date"
            },
            {
                dataField: "Region",
                dataType: "string"
            },
            {
                dataField: "Sector",
                dataType: "string",
            },
            {
                dataField: "Channel",
                dataType: "string",
            },
            {
                dataField: "Customer",
                dataType: "string",
                width: 150
            }
        ],
        onContentReady: function(e) {
            if(!collapsed) {
                collapsed = true;
                e.component.expandRow(["EnviroCare"]);
            }
        }
    });
});

var discountCellTemplate = function(container, options) {
    $("<div/>").dxBullet({
        onIncidentOccurred: null,
        size: {
            width: 150,
            height: 35
        },
        margin: {
            top: 5,
            bottom: 0,
            left: 5
        },
        showTarget: false,
        showZeroLevel: true,
        value: options.value * 100,
        startScaleValue: 0,
        endScaleValue: 100,
        tooltip: {
            enabled: true,
            font: {
                size: 18
            },
            paddingTopBottom: 2,
            customizeTooltip: function() {
                return { text: options.text };
            },
            zIndex: 5
        }
    }).appendTo(container);
};

var collapsed = false;
