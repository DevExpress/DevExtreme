$(function(){
    $("#productsSimple").dxTagBox({
        items: simpleProducts
    });
    
    $("#productsSearch").dxTagBox({
        items: simpleProducts,
        searchEnabled: true
    });
    
    $("#productsSelection").dxTagBox({
        items: simpleProducts,
        showSelectionControls: true,
        applyValueMode: "useButtons"
    });
    
    $("#productsHide").dxTagBox({
        items: simpleProducts,
        hideSelectedItems: true
    });
    
    $("#productsLine").dxTagBox({
        items: simpleProducts,
        multiline: false
    });
    
    $("#productsEdit").dxTagBox({
        items: simpleProducts,
        acceptCustomValue: true,
        onCustomItemCreating: function(args) {
            var newValue = args.text,
                component = args.component,
                currentItems = component.option("items");
            currentItems.unshift(newValue);
            component.option("items", currentItems);
            args.customItem = newValue;
        }
    });
    
    $("#productsPlaceholder").dxTagBox({
        items: simpleProducts,
        placeholder: "Choose Product..."
    });
    
    $("#productsDisabled").dxTagBox({
        items: simpleProducts,
        value: [simpleProducts[0]],
        disabled: true
    });
    
    $("#productsDataSource").dxTagBox({
        dataSource: new DevExpress.data.ArrayStore({ 
            data: products,
            key: "ID"
        }),
        displayExpr: "Name",
        valueExpr: "ID",
    });
    
    $("#productsCustom").dxTagBox({
        dataSource: products,
        displayExpr: "Name",
        valueExpr: "ID",
        itemTemplate: function(data) {
            return "<div class='custom-item'><img src='" + 
            data.ImageSrc + "' /><div class='product-name'>" + 
            data.Name + "</div></div>";
        }
    });
});