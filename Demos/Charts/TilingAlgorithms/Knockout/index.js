window.onload = function() {
    var algorithms = ["sliceAndDice", "squarified", "strip", "custom"],
        currentAlgorithmName = ko.observable(algorithms[2]),
        currentAlgorithm = ko.observable(currentAlgorithmName());
        
    
    var viewModel = {
        treeMapOptions: {
            dataSource: populationByAge,
            colorizer: {
                type: "discrete",    
                colorizeGroups: true
            },
            title: "Population by Age Groups",
            layoutAlgorithm: currentAlgorithm,
            tooltip: {
                enabled: true,
                format: "thousands",
                customizeTooltip: function (arg) {
                    var data = arg.node.data,
                        parentData = arg.node.getParent().data,
                        result = "";
                
                    if (arg.node.isLeaf()) {
                        result = "<span class='country'>" + parentData.name + "</span><br />" +
                        data.name + "<br />" + arg.valueText + " (" +
                        (100 * data.value/parentData.total).toFixed(1) + "%)";
                    } else {
                        result = "<span class='country'>" + data.name + "</span>";
                    }
    
                    return {
                        text: result
                    };
                }
            }
        },
        selectBoxOptions: {
            items: algorithms,
            value: currentAlgorithmName,
            width: 200,
            onValueChanged: function(data) {
                if(data.value == "custom") {
                    currentAlgorithm(customAlgorithm);
                } else {
                    currentAlgorithm(data.value);
                }
            }
        }
    };
    
    function customAlgorithm(arg) {
        var side = 0,
            totalRect = arg.rect.slice(),
            totalSum = arg.sum;
     
        arg.items.forEach(function (item) {
            var size = Math.round((totalRect[side + 2] -
                    totalRect[side]) * item.value / totalSum),
                rect = totalRect.slice();
    
            totalSum -= item.value;
            rect[side + 2] = totalRect[side] = totalRect[side] + size;
            item.rect = rect;
            side = 1 - side;
        });
    }
    
    ko.applyBindings(viewModel, document.getElementById("treemap-demo"));
};