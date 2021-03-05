$(function() {
    var editor = $(".html-editor").dxHtmlEditor({
        height: 725,
        toolbar: {
            items: [
                "undo", "redo", "separator",
                {
                    name: "size",
                    acceptedValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"] },
                {
                    name: "font",
                    acceptedValues: ["Arial", "Courier New", "Georgia", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"]
                },
                "separator", "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                "orderedList", "bulletList", "separator",
                {
                    name: "header",
                    acceptedValues: [false, 1, 2, 3, 4, 5]
                }, "separator",
                "color", "background", "separator",
                "link", "image", "separator",
                "clear", "codeBlock", "blockquote", "separator",
                "insertTable", "deleteTable",
                "insertRowAbove", "insertRowBelow", "deleteRow",
                "insertColumnLeft", "insertColumnRight", "deleteColumn"
            ]
        },
        mediaResizing: {
            enabled: true
        }
    }).dxHtmlEditor("instance");

    $("#multiline").dxCheckBox({
        text: "Multiline toolbar",
        value: true,
        onValueChanged: function(e) {
            editor.option("toolbar.multiline", e.value);
        }
    });
});
