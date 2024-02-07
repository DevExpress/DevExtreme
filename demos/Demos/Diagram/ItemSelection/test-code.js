testUtils.importAnd(() => 'devextreme/ui/diagram', () => DevExpress.ui.dxDiagram, (dxDiagram) => {
  const diagram = dxDiagram.getInstance(document.getElementById('diagram'));
  const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.text === 'Greta Sims'));
  if (items.length > 0) {
    diagram.scrollToItem(items[0]);
  }
});
