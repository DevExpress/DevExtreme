$(() => {
  $('#context-menu').dxContextMenu({
    dataSource: contextMenuItems,
    width: 200,
    target: '#image',
    onItemClick(e) {
      if (!e.itemData.items) {
        DevExpress.ui.notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
      }
    },
  });
});
