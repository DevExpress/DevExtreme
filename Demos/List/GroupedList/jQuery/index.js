$(function(){
    $("#simpleList").dxList({
        dataSource: employees,
        height: "100%",
        grouped: true,
        collapsibleGroups: true,
        groupTemplate: function(data) {
            return $("<div>Assigned: " + data.key + "</div>");
    
        }
    });
    
});