$(function(){
    var listWidget = $("#list").dxList({
        dataSource: products,
        height: 400,
        searchEnabled: true,
        searchExpr: "Name",
        itemTemplate: function(data) {
            return $("<div>").text(data.Name);
        }
    }).dxList("instance");

    $("#searchMode").dxSelectBox({
        dataSource: ["contains", "startswith"],
        value: "contains",
        onValueChanged: function(data) {
            listWidget.option("searchMode", data.value);
        }
    }).dxSelectBox("instance");
});