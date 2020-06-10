$(function(){
    var store = DevExpress.data.AspNet.createStore({
      loadUrl: "https://js.devexpress.com/Demos/Mvc/api/ListData/Orders",
    });

    var listData = new DevExpress.data.DataSource({
      store: store,
      paginate: true,
      pageSize: 1,
      sort: "ProductName",
      group: "Category.CategoryName",
      filter: [ 'UnitPrice', '>', 15 ],
    });
  
    $("#list").dxList({
        dataSource: listData,
        itemTemplate: function(data) {
            var price = Globalize.formatCurrency(data.UnitPrice, "USD", { maximumFractionDigits: 2 });
            return $("<div>")
              .append($("<div>").text(data.CategoryName))
              .append($("<div>").text(data.ProductName))
              .append($("<b>").text(price));
        },
        grouped: true,
        collapsibleGroups: true,
        selectionMode: "multiple",
        showSelectionControls: true,
        pageLoadMode: "scrollBottom",
        height: 600
    });
});