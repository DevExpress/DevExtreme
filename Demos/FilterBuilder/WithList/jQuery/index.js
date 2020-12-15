$(function() {
    var currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    var filterBuilderInstance = $("#filterBuilder").dxFilterBuilder({
        fields: fields,
        value: filter
    }).dxFilterBuilder("instance");

    $("#listWidget").dxList({
        dataSource: new DevExpress.data.DataSource({
            store: products,
            filter: filterBuilderInstance.getFilterExpression()
        }),
        height: "100%",
        itemTemplate: function(data, index) {
            var result = $("<div>").addClass("product");
            $("<img>").attr("src", data.ImageSrc).appendTo(result);
            $("<div>").text(data.Name).appendTo(result);
            $("<div>").addClass("price")
                .html(currencyFormatter.format(data.Price)).appendTo(result);
            return result;
        }
    });

    $("#apply").dxButton({
        text: "Apply Filter",
        type: "default",
        onClick: function() {
            var filter = filterBuilderInstance.getFilterExpression(),
                dataSource = $("#listWidget").dxList("instance").getDataSource();
            dataSource.filter(filter);
            dataSource.load();
        },
    });
});