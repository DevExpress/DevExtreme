window.onload = function() {
    var colorizationOptions = [{
        name: "Discrete",
        options: {
            type: "discrete",
            palette: "harmony light",
            colorizeGroups: false
        }
    }, {
        name: "Grouped",
        options: {
            type: "discrete",
            palette: "harmony light",
            colorizeGroups: true
        }
    }, {
        name: "Range",
        options: {
            type: "range",
            palette: ["#fbd600", "#78299a"],
            range: [0, 50000, 100000, 150000, 200000, 250000],
            colorCodeField: "salesAmount",
            colorizeGroups: false
        }
    }, {
        name: "Gradient",
        options: {
            type: "gradient",
            palette: ["#fbd600", "#78299a"],
            range: [10000, 250000],
            colorCodeField: "salesAmount",
            colorizeGroups: false
        }
    }],
    startColorization = ko.observable(colorizationOptions[2].options);
    
    var viewModel = {
        treeMapOptions: {
            dataSource: salesAmount,
            colorizer: startColorization,
            title: "Sales Amount by Product",
            valueField: "salesAmount",
            tooltip: {
                enabled: true,
                format: "currency",
                customizeTooltip: function (arg) {
                    var data = arg.node.data;
    
                    return {
                        text: arg.node.isLeaf() ? ("<span class='product'>" + data.name +
                           "</span><br/>Sales Amount: " + arg.valueText) : null
                    };
                }
            }
        },
        selectBoxOptions: {
            displayExpr: "name",
            items: colorizationOptions,
            value: colorizationOptions[2],
            onValueChanged: function(e) {
                startColorization(e.value.options);
            },
            width: 200
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treemap-demo"));
};