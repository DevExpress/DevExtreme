window.onload = function() {
    var selectAllMode = ko.observable("allPages"),
        showCheckBoxesMode = ko.observable("onClick");
        
    var viewModel = {
        gridOptions: {
            dataSource: sales,
            keyExpr: "orderId",
            showBorders: true,
            selection: {
                mode: "multiple",
                selectAllMode: selectAllMode,
                showCheckBoxesMode: showCheckBoxesMode
            },
            paging: {
                pageSize: 10
            },
            filterRow: { 
                visible: true
            },
            columns: [{ 
                dataField: "orderId", 
                caption: "Order ID",
                width: 90
            },
            "city", { 
                dataField: "country", 
                width: 180
            },
            "region", {
                dataField: "date",
                dataType: "date"
            }, {
                dataField: "amount",
                format: "currency",
                width: 90
            }]
        },
        selectAllMode: {
            dataSource: ["allPages", "page"],
            value: selectAllMode,
            disabled: ko.computed(function() {
                return showCheckBoxesMode() === "none";
            })
        },
        checkBoxesMode: {
            dataSource: [ "none", "onClick", "onLongTap", "always"],
            value: showCheckBoxesMode
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("grid"));
};