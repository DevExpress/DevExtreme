$(function() {
    $("#custom-icon").dxSelectBox({
        items: simpleProducts,
        dropDownButtonTemplate: function() {
            return $("<img>", {
                src: "../../../../images/icons/custom-dropbutton-icon.svg",
                class: "custom-icon"
            });
        }
    });
    
    var $loadIndicator = $("<div>").dxLoadIndicator({ visible: false }),
        $dropDownButtonImage = $("<img>", {
            src: "../../../../images/icons/custom-dropbutton-icon.svg",
            class: "custom-icon"
        });
    
    $("#load-indicator").dxSelectBox({
        dropDownButtonTemplate: function(data, element) {
            $(element).append($loadIndicator, $dropDownButtonImage);
        },
        dataSource: {
            loadMode: 'raw',
            load: function() {
                var loadIndicator = $loadIndicator.dxLoadIndicator("instance"),
                    d = $.Deferred();
                
                $dropDownButtonImage.hide();
                loadIndicator.option("visible", true);
                
                setTimeout(function() {
                    d.resolve(simpleProducts);
                    $dropDownButtonImage.show();
                    loadIndicator.option("visible", false);
                }, 3000);
                return d.promise();
            }
        }
    });

    var dropDownButtonTemplate = function(selectedItem){
        if(selectedItem){
            return function(){
                return $("<img>", {
                    src: "../../../../images/icons/" + selectedItem.IconSrc,
                    class: "custom-icon"
                });
            };
        } else {
            return "dropDownButton";
        }
    };

    $("#dynamic-template").dxSelectBox({
        items: products,
        displayExpr: "Name",
        showClearButton: true,
        valueExpr: "ID",
        value: 1,
        itemTemplate: function(data) {
            return "<div class='custom-item'><img src='../../../../images/icons/" +
                data.IconSrc + "' /><div class='product-name'>" +
                data.Name + "</div></div>";
        },
        onSelectionChanged: function(e) {
            e.component.option("dropDownButtonTemplate", dropDownButtonTemplate(e.selectedItem));
        }
    });
});
