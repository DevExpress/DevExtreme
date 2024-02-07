$(() => {
  $('#maxDisplayedTags').dxTagBox({
    items: products,
    value: [1, 2, 3, 4],
    displayExpr: 'Name',
    valueExpr: 'ID',
    showSelectionControls: true,
    maxDisplayedTags: 3,
    inputAttr: productLabel,
  });

  $('#onMultiTagPreparing').dxTagBox({
    items: products.slice(0, 5),
    value: [1, 2, 3, 4, 5],
    displayExpr: 'Name',
    valueExpr: 'ID',
    showSelectionControls: true,
    maxDisplayedTags: 3,
    inputAttr: productLabel,
    onMultiTagPreparing(args) {
      const selectedItemsLength = args.selectedItems.length;
      const totalCount = 5;

      if (selectedItemsLength < totalCount) {
        args.cancel = true;
      } else {
        args.text = `All selected (${selectedItemsLength})`;
      }
    },
  });

  $('#showMultiTagOnly').dxTagBox({
    items: products,
    value: [1, 2, 3, 4, 5, 6, 7],
    displayExpr: 'Name',
    valueExpr: 'ID',
    showSelectionControls: true,
    maxDisplayedTags: 2,
    showMultiTagOnly: false,
    inputAttr: productLabel,
  });
});
