var DemoApp = angular.module('DemoApp', ['dx']);

const url = "https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView";

DemoApp.controller('DemoController', function DemoController($scope) {
    
    $scope.gridOptions = {
        showBorders: true,
        dataSource: DevExpress.data.AspNet.createStore({
            key: "SupplierID",
            loadUrl: url + "/GetSuppliers"
        }),
        paging: {
            pageSize: 15
        },
        remoteOperations: true,
        columns: [
            "ContactName",
            "ContactTitle",
            "CompanyName",
            "City",
            "Country"
        ],
        masterDetail: {
            enabled: true,
            template: "masterDetail"
        }
    };

    $scope.getTabPanelOptions = function(masterDetailData) {
        return {
            items: [{
                title: "Orders",
                template: "ordersTab"
            }, {
                title: "Address",
                template: "addressTab",
            }]
        };        
    };


    $scope.getAddressTabOptions = function(data) {
        return {
            formData: data,
            colCount: 2,
            customizeItem: function(item) {
                item.template = "formItemTemplate";
            },
            items: ["Address", "City", "Region", "PostalCode", "Country", "Phone"]
        };
    }
});

DemoApp.controller("OrdersTabController", function OrdersTabController($scope) {

    function createOrderHistoryStore(productID) {
        return DevExpress.data.AspNet.createStore({
            key: "OrderID",
            loadParams: { ProductID: productID },
            loadUrl: url + "/GetOrdersByProduct"
        });
    }

    $scope.getOrdersTabOptions = function(masterDetailData) {
        return {
            labelLocation: "top",
            items: [{
                label: { text: "Product" },
                template: "productSelectBox"
            }, {
                label: { text: "Order History" },
                template: "orderHistory"
            }]
        };
    };

    $scope.getSelectBoxOptions = function(masterDetailData) {
        return {
            dataSource: DevExpress.data.AspNet.createStore({
                key: "ProductID",
                loadParams: { SupplierID: masterDetailData.SupplierID },
                loadUrl: url + "/GetProductsBySupplier"
            }),
            valueExpr: "ProductID",
            displayExpr: "ProductName",
            deferRendering: false,
            onContentReady: function(e) {
                let firstItem = e.component.option("items[0]");
                if(firstItem) {
                    e.component.option("value", firstItem.ProductID);
                }
            },
            onValueChanged: function(e) {
                $scope.dataSource = createOrderHistoryStore(e.value);
            }
        };
    };

    $scope.orderHistoryDataGridOptions = {
        bindingOptions: {
            dataSource: {
                deep: false,
                dataPath: "dataSource"
            }
        },
        paging: {
            pageSize: 5
        },
        showBorders: true,
        columns: [
            "OrderID",
            {
                dataField: "OrderDate",
                dataType: "date"
            },
            "ShipCountry",
            "ShipCity",
            {
                dataField: "UnitPrice",
                format: "currency"
            },
            "Quantity",
            {
                dataField: "Discount",
                format: "percent"
            }
        ],
        summary: {
            totalItems: [{
                column: "UnitPrice",
                summaryType: "sum",
                valueFormat: {
                    format: "currency",
                    precision: 2
                }
            }, {
                column: "Quantity",
                summaryType: "count"
            }]
        }
    };
});

