$(() => {
  $('#simple-treeview').dxTreeView({
    items: products,
    dataStructure: 'plain',
    parentIdExpr: 'categoryId',
    keyExpr: 'ID',
    displayExpr: 'name',
    width: 300,
    onItemClick(e) {
      const item = e.itemData;
      if (item.price) {
        $('#product-details').removeClass('hidden');
        $('#product-details > img').attr('src', item.icon);
        $('#product-details > .price').text(`$${item.price}`);
        $('#product-details > .name').text(item.name);
      } else {
        $('#product-details').addClass('hidden');
      }
    },
  });
});
