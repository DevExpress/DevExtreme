$(function() {
    $("#single-selection").dxButtonGroup({
        items: alignments,
        keyExpr: "alignment",
        stylingMode: "outlined",
        selectedItemKeys: ["left"],
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    });

    $("#multiple-selection").dxButtonGroup({
        items: fontStyles,
        keyExpr: "style",
        stylingMode: "outlined",
        selectionMode: "multiple",
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    });

    $("#single-selection-styling-mode").dxButtonGroup({
        items: alignments,
        keyExpr: "alignment",
        stylingMode: "text",
        selectedItemKeys: ["left"],
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    });

    $("#multiple-selection-styling-mode").dxButtonGroup({
        items: fontStyles,
        keyExpr: "style",
        stylingMode: "text",
        selectionMode: "multiple",
        onItemClick: function(e){
            DevExpress.ui.notify({ message: 'The "' + e.itemData.hint + '" button was clicked', width: 320 }, "success", 1000);
        }
    });
});
