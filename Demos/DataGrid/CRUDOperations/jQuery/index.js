$(function(){
    var URL = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";

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

    var dataGrid = $("#grid").dxDataGrid({     
        dataSource: ordersStore,
        repaintChangesOnly: true,
        showBorders: true,
        editing: {
            refreshMode: "reshape",
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
    }).dxDataGrid("instance");

    $("#refresh-mode").dxSelectBox({
        items: ["full", "reshape", "repaint"],
        value: "reshape",
        onValueChanged: function(e) {
            dataGrid.option("editing.refreshMode", e.value);  
        }
    });

    $("#clear").dxButton({
        text: "Clear",
        onClick: function() {
            $("#requests ul").empty();
        }
    });

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

        var logList = $("#requests ul"),
            time = DevExpress.localization.formatDate(new Date(), "HH:mm:ss"),
            newItem = $("<li>").text([time, method, url.slice(URL.length), args].join(" "));
        
        logList.prepend(newItem);
    }
});