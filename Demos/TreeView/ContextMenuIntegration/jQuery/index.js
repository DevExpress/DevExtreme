$(function(){
    var selectedTreeItem = undefined;
    var logItems = [];    
    var treeView = $("#treeview").dxTreeView({
        items: products,
        width: 300,
        height: 450,
        onItemContextMenu: onTreeViewItemContextMenu
    }).dxTreeView('instance');

    var contextMenu = $('#contextMenu').dxContextMenu({
        dataSource: menuItems,
        target: '#treeview .dx-treeview-item',
        onItemClick: onContextMenuItemClick
    }).dxContextMenu('instance');

    var log = $("#log").dxList({
        width: 400,
        height: 300,
        showScrollbar: "always"
    }).dxList("instance");
    
    function onTreeViewItemContextMenu(e) {
        selectedTreeItem = e.itemData;

        var isProduct = e.itemData.price !== undefined;
        contextMenu.option('items[0].visible', !isProduct);
        contextMenu.option('items[1].visible', !isProduct);
        contextMenu.option('items[2].visible', isProduct);
        contextMenu.option('items[3].visible', isProduct);

        contextMenu.option('items[0].disabled', e.node.expanded);
        contextMenu.option('items[1].disabled', !e.node.expanded);
    }

    function onContextMenuItemClick(e){
        var logEntry = '';
        switch(e.itemData.id) {
            case 'expand': {
                logEntry = 'The "' + selectedTreeItem.text + '" group was expanded';
                treeView.expandItem(selectedTreeItem.id);
                break;
            }
            case 'collapse': {
                logEntry = 'The "' + selectedTreeItem.text + '" group was collapsed';
                treeView.collapseItem(selectedTreeItem.id);
                break;
            }
            case 'details': {
                logEntry = 'Details about "' + selectedTreeItem.text + '" were displayed';
                break;
            }
            case 'copy': {
                logEntry = 'Information about "' + selectedTreeItem.text + '" was copied';
                break;
            }
        }
        logItems.push(logEntry);
        log.option('items', logItems);
    }
});