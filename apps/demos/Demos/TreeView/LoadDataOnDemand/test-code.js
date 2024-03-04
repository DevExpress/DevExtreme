testUtils.importAnd(() => 'devextreme/ui/tree_view', () => DevExpress.ui.dxTreeView, (dxTreeView) => {
  const treeView = dxTreeView.getInstance(document.getElementById('simple-treeview'));
  function changeCreateChildren(treeViewInstance) {
    treeViewInstance.option('createChildren', () => [
      { text: 'Video Players', hasItems: false },
      { text: 'Televisions' },
      { text: 'Monitors' },
      { text: 'Projectors' },
    ]);
    treeViewInstance.option('dataSource', []);
  }

  changeCreateChildren(treeView);
  treeView.option('onOptionChanged', (e) => {
    if (e.name === 'items' && Array.isArray(e.value) && e.value.length !== 4) {
      changeCreateChildren(treeView);
    }
  });
});
