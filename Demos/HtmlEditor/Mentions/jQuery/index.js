$(function() {
    $("#html-editor").dxHtmlEditor({
        mentions: [{
            dataSource: employees,
            searchExpr: "text",
            displayExpr: "text",
            valueExpr: "text"
        }]
    });
});
