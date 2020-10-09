var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.multilineToolbar = true;

    $scope.htmlEditorOptions = {
        bindingOptions: {
            "toolbar.multiline": "multilineToolbar"
        },
        height: 725,
        toolbar: {
            items: [
                "undo", "redo", "separator",
                {
                    formatName: "size",
                    formatValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]
                },
                {
                    formatName: "font",
                    formatValues: ["Arial", "Courier New", "Georgia", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"]
                },
                "separator", "bold", "italic", "strike", "underline", "separator",
                "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                "orderedList", "bulletList", "separator",
                {
                    formatName: "header",
                    formatValues: [false, 1, 2, 3, 4, 5]
                }, "separator",
                "color", "background", "separator",
                "link", "image", "separator",
                "clear", "codeBlock", "blockquote", "separator",
                "insertTable", "insertRowAbove", "insertRowBelow", "insertColumnLeft", "insertColumnRight",
                "deleteRow", "deleteColumn", "deleteTable"
            ]
        },
        mediaResizing: {
            enabled: true
        }
    };

    $scope.multilineSwitcherOptions = {
        bindingOptions: {
            value: "multilineToolbar"
        },
        text: "Multiline toolbar"
    };
});
