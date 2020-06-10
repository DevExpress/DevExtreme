$(function(){
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
    var store = new DevExpress.data.CustomStore({
        key: "OrderNumber",
        load: function (loadOptions) {
            var deferred = $.Deferred(),
                args = {};

            [
                "skip",
                "take",
                "requireTotalCount",
                "requireGroupCount",
                "sort",
                "filter",
                "totalSummary",
                "group",
                "groupSummary"
            ].forEach(function(i) {
                if (i in loadOptions && isNotEmpty(loadOptions[i]))
                    args[i] = JSON.stringify(loadOptions[i]);
            });
            $.ajax({
                url: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders",
                dataType: "json",
                data: args,
                success: function(result) {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                },
                error: function() {
                    deferred.reject("Data Loading Error");
                },
                timeout: 5000
            });

            return deferred.promise();
        }
    });

    $("#gridContainer").dxDataGrid({
        dataSource: store,
        showBorders: true,
        remoteOperations: true,
        paging: {
            pageSize: 12
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [8, 12, 20]
        },
        columns: [{
            dataField: "OrderNumber",
            dataType: "number"
        }, {
            dataField: "OrderDate",
            dataType: "date"
        }, {
            dataField: "StoreCity",
            dataType: "string"
        }, {
            dataField: "StoreState",
            dataType: "string"
        }, {
            dataField: "Employee",
            dataType: "string"
        }, {
            dataField: "SaleAmount",
            dataType: "number",
            format: "currency"
        }]
    }).dxDataGrid("instance");
});
