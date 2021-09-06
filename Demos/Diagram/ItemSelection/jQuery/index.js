$(() => {
  $('#diagram').dxDiagram({
    nodes: {
      dataSource: new DevExpress.data.ArrayStore({
        key: 'ID',
        data: employees,
      }),
      keyExpr: 'ID',
      textExpr: 'Full_Name',
      parentKeyExpr: 'Head_ID',
      autoLayout: {
        type: 'tree',
      },
    },
    onContentReady(e) {
      const diagram = e.component;
      // preselect some shape
      const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.text === 'Greta Sims'));
      if (items.length > 0) {
        diagram.setSelectedItems(items);
        diagram.scrollToItem(items[0]);
        diagram.focus();
      }
    },
    onSelectionChanged(e) {
      const items = e.items
        .filter((item) => item.itemType === 'shape')
        .map((item) => item.text);
      if (items.length > 0) { $('#selected-items-container').text(items.join(', ')); } else { $('#selected-items-container').text('Nobody has been selected'); }
    },
    propertiesPanel: {
      visibility: 'disabled',
    },
    toolbox: {
      visibility: 'disabled',
    },
  }).dxDiagram('instance');
});
