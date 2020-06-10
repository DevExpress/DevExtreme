window.onload = function() {
    var orders = new DevExpress.data.CustomStore({
        load: function (loadOptions) {
            var deferred = $.Deferred(),
                params = "?";
    
            params += "skip=" + loadOptions.skip;
            params += "&take=" + loadOptions.take;
    
            if (loadOptions.sort) {
                params += "&orderby=" + loadOptions.sort[0].selector;
                if (loadOptions.sort[0].desc)
                    params += " desc";
            }
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://js.devexpress.com/Demos/WidgetsGallery/data/orderItems" + params, true);
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var result = JSON.parse(xhr.responseText);
                        deferred.resolve(result.items, { 
                            totalCount: result.totalCount
                        });
                    } else {
                        deferred.reject("Data Loading Error");
                    }
                }
            };
            xhr.send();
    
            return deferred.promise();
        }
    });
    
    var viewModel = {
        dataGridOptions: {
            dataSource: {
                store: orders
            },
            showBorders: true,
            remoteOperations: {
                sorting: true,
                paging: true
            },
            paging: {
                pageSize: 12
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [8, 12, 20]
            },
            columns: [
                "OrderNumber", "OrderDate", "StoreCity", "StoreState", "Employee", {
                    dataField: "SaleAmount",
                    format: "currency"
                }
            ]
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("data-grid-demo"));
};