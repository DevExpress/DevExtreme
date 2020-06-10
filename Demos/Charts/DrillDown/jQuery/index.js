$(function(){
    $("#treemap").dxTreeMap({
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
            var markup = $("#drill-down-title").empty(),
                node;
            for (node = e.node.getParent(); node; node = node.getParent()) {
                markup.prepend(" > ").prepend($("<span />")
                    .addClass("link")
                    .text(node.label() || "All Continents")
                    .data("node", node)
                    .on("dxclick", onLinkClick));
            }
            if (markup.children().length) {
                markup.append(e.node.label());
            }
        }
    });
    
    function onLinkClick(e) {
        $(e.target).data("node").drillDown();
    }
});