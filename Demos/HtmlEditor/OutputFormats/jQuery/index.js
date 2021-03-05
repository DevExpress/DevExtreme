$(function() {
    var editorInstance = $(".html-editor").dxHtmlEditor({
        height: 300,
        toolbar: {
            items: [
                "undo", "redo", "separator",
                {
                    name: "size",
                    acceptedValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]
                },
                {
                    name: "font",
                    acceptedValues: ["Arial", "Courier New", "Georgia", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"]
                },
                "separator",
                "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                "color", "background"
            ]
        },
        onValueChanged: function(e) {
            $(".value-content").text(e.component.option("value"));
        }
    }).dxHtmlEditor("instance");

    $(".value-types").dxButtonGroup({
        items: [{ text: "Html" }, { text: "Markdown" }],
        selectedItemKeys: ["Html"],
        onSelectionChanged: function(e) {
            editorInstance.option("valueType", e.addedItems[0].text.toLowerCase());
            $(".value-content").text(editorInstance.option("value"));
        }
    });
});
