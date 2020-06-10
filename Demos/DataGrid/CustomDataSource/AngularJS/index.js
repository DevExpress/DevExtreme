var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope, $http, $q) {
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
    var store = new DevExpress.data.CustomStore({
        key: "OrderNumber",
        load: function(loadOptions) {
            var params = {};
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
                if(i in loadOptions && isNotEmpty(loadOptions[i]))
                    params[i] = JSON.stringify(loadOptions[i]);
            });
            return $http.get("https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders", {params: params})
            .then(function (response) {
                return {
                    data: response.data.data,
                    totalCount: response.data.totalCount,
                    summary: response.data.summary,
                    groupCount: response.data.groupCount
                };
            }, function (response) {
                return $q.reject("Data Loading Error");
            });
        }
    });

    $scope.dataGridOptions = {
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
    };
});