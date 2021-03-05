$(function() {
    var popupInstance;
    var editorInstance = $(".html-editor").dxHtmlEditor({
        toolbar: {
            items: [
                "undo", "redo", "separator",
                {
                    name: "header",
                    acceptedValues: [false, 1, 2, 3, 4, 5]
                }, "separator",
                "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                {
                    widget: "dxButton",
                    options: {
                        text: "Show markup",
                        stylingMode: "text",
                        onClick: function() {
                            popupInstance.show();
                        }
                    }
                }
            ]
        }
    }).dxHtmlEditor("instance");

    popupInstance = $("#popup").dxPopup({
        showTitle: true,
        title: "Markup",
        onShowing: function() {
            $(".value-content").text(editorInstance.option("value"));
        }
    }).dxPopup("instance");
});
