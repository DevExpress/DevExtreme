$(function(){
    $("#toolbar").dxToolbar({
        items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'back',
                    onClick: function() {
                        DevExpress.ui.notify("Back button has been clicked!");
                    }
                }
            }, {
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    icon: "refresh",
                    onClick: function() {
                        DevExpress.ui.notify("Refresh button has been clicked!");
                    }
                }
            }, {
                location: 'center',
                locateInMenu: 'never',
                template: function() {
                    return $("<div class='toolbar-label'><b>Tom's Club</b> Products</div>");
                }
            }, {
                location: 'after',
                widget: 'dxSelectBox',
                locateInMenu: 'auto',
                options: {
                    width: 140,
                    items: productTypes,
                    valueExpr: "id",
                    displayExpr: "text",
                    value: productTypes[0].id,
                    onValueChanged: function(args) {
                        if(args.value > 1) {
                            productsStore.filter("type" , "=", args.value);
                        } else {
                            productsStore.filter(null);
                        }
                        productsStore.load();
                    }
                }
            }, {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    icon: "plus",
                    onClick: function() {
                        DevExpress.ui.notify("Add button has been clicked!");
                    }
                }
            }, {
                locateInMenu: 'always',
                widget: 'dxButton',
                options: {
                    text: 'Save',
                    onClick: function() {
                        DevExpress.ui.notify("Save option has been clicked!");
                    }
                }
            }, {
                locateInMenu: 'always',
                widget: 'dxButton',
                options: {
                    text: 'Print',
                    onClick: function() {
                        DevExpress.ui.notify("Print option has been clicked!");
                    }
                }
            }, {
                locateInMenu: 'always',
                widget: 'dxButton',
                options: {
                    text: 'Settings',
                    onClick: function() {
                        DevExpress.ui.notify("Settings option has been clicked!");
                    }
                }
            }
        ]
    });
    
    var productsStore = new DevExpress.data.DataSource(products);
    
    $("#products").dxList({
        dataSource: productsStore
    });
});