$(function() {
    $("#html-editor").dxHtmlEditor({
        height: 350,
        toolbar: {
            items: [
                {
                    formatName: "header",
                    formatValues: [false, 1, 2, 3]
                },
                "separator", "bold", "color", "separator",
                "alignLeft", "alignCenter", "alignRight", "separator",
                "insertTable", "deleteTable",
                "insertRowAbove", "insertRowBelow", "deleteRow",
                "insertColumnLeft", "insertColumnRight", "deleteColumn"
            ]
        }
    });
});
