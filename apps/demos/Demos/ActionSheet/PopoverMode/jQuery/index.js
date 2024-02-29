$(() => {
  const actionSheet = $('#action-sheet').dxActionSheet({
    dataSource: actionSheetItems,
    title: 'Choose action',
    usePopover: true,
    onItemClick(value) {
      DevExpress.ui.notify(`The "${value.itemData.text}" button is clicked.`);
    },
  }).dxActionSheet('instance');

  $('#list').dxList({
    dataSource: contacts,
    itemTemplate(itemData, itemIndex, itemElement) {
      itemElement.append(
        $('<div />').text(itemData.name),
        $('<div />').text(itemData.phone),
        $('<div />').text(itemData.email),
      );
    },
    onItemClick(e) {
      actionSheet.option('target', e.itemElement);
      actionSheet.option('visible', true);
    },
  });
});
