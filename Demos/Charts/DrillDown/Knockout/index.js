window.onload = function() {
    var markup = ko.observableArray([]);
    
    var viewModel = {
        markup: markup,
        treeMapOptions: {
            dataSource: citiesPopulation,
            size: {
                height: 440
            },
            title: {
                text: "The Most Populated Cities by Continents",
                placeholderSize: 80
            },
            colorizer: {
                palette: "soft"
            },
            interactWithGroup: true,
            maxDepth: 2,
            onClick: function(e) {
                e.node.drillDown();
            },
            onDrill: function(e) {
                var node;
                viewModel.markup([]);
                for (node = e.node.getParent(); node; node = node.getParent()) {
                    viewModel.markup.unshift({
                        html: "<span class='link'>" + (node.label() || "All Continents") + "</span> <span> > </span>",
                        node: node
                    });
                }
                if (viewModel.markup().length) {
                    viewModel.markup.push({
                        html: e.node.label(),
                        node: e.node
                    });
                }
            }
        },
        onLinkClick: function(e) {
            e.node.drillDown();
        }
    };
    
    ko.applyBindings(viewModel, document.getElementById("treemap-demo"));
};