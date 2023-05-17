$(() => {
  $('#simple').dxNumberBox({
    inputAttr: { 'aria-label': 'Simple' },
  });

  $('#buttons').dxNumberBox({
    value: 20.5,
    showSpinButtons: true,
    showClearButton: true,
    inputAttr: { 'aria-label': 'With Spin And Buttons' },
  });

  $('#disabled').dxNumberBox({
    value: 20.5,
    showSpinButtons: true,
    showClearButton: true,
    disabled: true,
    inputAttr: { 'aria-label': 'Disabled' },
  });

  $('#minAndMax').dxNumberBox({
    value: 15,
    min: 10,
    max: 20,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Min And Max' },
  });

  const totalProductQuantity = 30;

  $('#sales').dxNumberBox({
    max: totalProductQuantity,
    min: 0,
    value: 16,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Sales' },
    onKeyDown(e) {
      const { event } = e;
      const str = event.key || String.fromCharCode(event.which);
      if (/^[.,e]$/.test(str)) {
        event.preventDefault();
      }
    },
    onValueChanged(data) {
      productInventory.option('value', totalProductQuantity - data.value);
    },
  });

  const productInventory = $('#stock').dxNumberBox({
    value: 14,
    min: 0,
    showSpinButtons: false,
    readOnly: true,
    inputAttr: { 'aria-label': 'Stock' },
  }).dxNumberBox('instance');
});
