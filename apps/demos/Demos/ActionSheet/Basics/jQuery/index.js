$(() => {
  const actionSheet = $('#action-sheet').dxActionSheet({
    dataSource: actionSheetItems,
    title: 'Choose action',
    onCancelClick() {
      showNotify('Cancel');
    },
    onItemClick(value) {
      showNotify(value.itemData.text);
    },
  }).dxActionSheet('instance');

  function showNotify(value) {
    DevExpress.ui.notify(`The "${value}" button is clicked.`);
  }

  $('#button').dxButton({
    text: 'Click to show Action Sheet',
    onClick() {
      actionSheet.option('visible', true);
    },
  });

  $('#show-title').dxSwitch({
    value: actionSheet.option('showTitle'),
    onValueChanged(e) {
      actionSheet.option('showTitle', e.value);
    },
  });

  $('#show-cancelbutton').dxSwitch({
    value: actionSheet.option('showCancelButton'),
    onValueChanged(e) {
      actionSheet.option('showCancelButton', e.value);
    },
  });
});
