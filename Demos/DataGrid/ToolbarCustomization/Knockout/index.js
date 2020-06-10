window.onload = function() {
    var expanded = ko.observable(true),
        expandButtonText = ko.observable("Collapse All");
    
    expanded.subscribe(function(newValue) {
        expandButtonText(newValue ? "Collapse All" : "Expand All");
    });
    
    var viewModel = {
        totalCount: ko.observable(getGroupCount("CustomerStoreState")),
        dataGridOptions: {
            dataSource: orders,
            showBorders: true,
            grouping: {
                autoExpandAll: expanded
            },
            columnChooser: {
                enabled: true
            },
            loadPanel: {
                enabled: true
            },    
            columns: [{
                dataField: "OrderNumber",
                caption: "Invoice Number"
            }, "OrderDate", "Employee", {
                caption: "City",
                dataField: "CustomerStoreCity"
            }, {
                caption: "State",
                groupIndex: 0,
                dataField: "CustomerStoreState",
            }, {
                dataField: "SaleAmount",
                alignment: "right",
                format: "currency"
            }],   
            onToolbarPreparing: function(e) {
                var dataGrid = e.component;
                
                e.toolbarOptions.items.unshift({
                    location: "before",
                    template: "totalGroupCount"
                }, {
                    location: "before",
                    widget: "dxSelectBox",
                    options: {
                        width: 200,
                        items: [{
                            value: "CustomerStoreState",
                            text: "Grouping by State"
                        }, {
                            value: "Employee",
                            text: "Grouping by Employee"
                        }],
                        displayExpr: "text",
                        valueExpr: "value",
                        value: "CustomerStoreState",
                        onValueChanged: function(e) {
                            dataGrid.clearGrouping();
                            dataGrid.columnOption(e.value, "groupIndex", 0);
                            viewModel.totalCount(getGroupCount(e.value));
                        }
                    }
                }, {
                    location: "before",
                    widget: "dxButton",
                    options: {
                        text: expandButtonText,
                        width: 136,
                        onClick: function(e) {
                            expanded(!expanded());
                        }
                    }
                }, {
                    location: "after",
                    widget: "dxButton",
                    options: {
                        icon: "refresh",
                        onClick: function() {
                            dataGrid.refresh();
                        }
                    }
                });
            }
        }
    };
    
    function getGroupCount(groupField) {
        return DevExpress.data.query(orders)
            .groupBy(groupField)
            .toArray().length;
    }
    
    ko.applyBindings(viewModel, document.getElementById("gridContainer"));
};