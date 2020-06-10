var DemoApp = angular.module('DemoApp', ['dx']);

var URL = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";

DemoApp.controller('DemoController', function DemoController($scope) {

    var ordersStore = new DevExpress.data.CustomStore({
        key: "OrderID",
        load: function() {
            return sendRequest(URL + "/Orders");
        },
        insert: function(values) {
            return sendRequest(URL + "/InsertOrder", "POST", {
                values: JSON.stringify(values)
            });
        },
        update: function(key, values) {
            return sendRequest(URL + "/UpdateOrder", "PUT", {
                key: key,
                values: JSON.stringify(values)
            });
        },
        remove: function(key) {
            return sendRequest(URL + "/DeleteOrder", "DELETE", {
                key: key
            });
        }
    });

    $scope.refreshMode = "reshape";
    $scope.requests = [];

    $scope.gridOptions = {
        bindingOptions: {
            "editing.refreshMode": "refreshMode"
        },
        dataSource: ordersStore,
        repaintChangesOnly: true,
        showBorders: true,
        editing: {
            mode: "cell",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true
        },
        scrolling: {
            mode: "virtual"
        },
        columns: [{
                dataField: "CustomerID",
                caption: "Customer",
                lookup: {
                    dataSource: {
                        paginate: true,
                        store: new DevExpress.data.CustomStore({
                            key: "Value",
                            loadMode: "raw",
                            load: function() {
                                return sendRequest(URL + "/CustomersLookup");
                            }
                        })
                    },
                    valueExpr: "Value",
                    displayExpr: "Text"
                }
            }, { 
                dataField: "OrderDate",
                dataType: "date"
            }, { 
                dataField: "Freight"
            }, {
                dataField: "ShipCountry"
            }, {
                dataField: "ShipVia",
                caption: "Shipping Company",
                dataType: "number",
                lookup: {
                    dataSource: new DevExpress.data.CustomStore({
                        key: "Value",
                        loadMode: "raw",
                        load: function() {
                            return sendRequest(URL + "/ShippersLookup");
                        }
                    }),
                    valueExpr: "Value",
                    displayExpr: "Text"
                }
            }
        ],
        summary: {
            totalItems: [{
                column: "CustomerID",
                summaryType: "count"
            }, {
                column: "Freight",
                valueFormat: "#0.00",
                summaryType: "sum"
            }]
        }
    };

    $scope.selectBoxOptions = {
        bindingOptions: {
            value: "refreshMode"
        },
        items: ["full", "reshape", "repaint"]
    };

    $scope.buttonOptions = {
        text: "Clear",
        onClick: function() {
            $scope.requests = [];
        }
    };

    function sendRequest(url, method, data) {
        var d = $.Deferred();
    
        method = method || "GET";

        logRequest(method, url, data);
    
        $.ajax(url, {
            method: method || "GET",
            data: data,
            cache: false,
            xhrFields: { withCredentials: true }
        }).done(function(result) {
            d.resolve(method === "GET" ? result.data : result);
        }).fail(function(xhr) {
            d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
        });
    
        return d.promise();
    }

    function logRequest(method, url, data) {
        var args = Object.keys(data || {}).map(function(key) {
            return key + "=" + data[key];
        }).join(" ");

        var time = DevExpress.localization.formatDate(new Date(), "HH:mm:ss");

        $scope.requests.unshift([time, method, url.slice(URL.length), args].join(" "));
    }    

});