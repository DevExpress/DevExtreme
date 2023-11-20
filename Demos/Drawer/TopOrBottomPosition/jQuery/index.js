$(() => {
  $('#content').html(text);

  const drawer = $('#drawer').dxDrawer({
    height: 400,
    revealMode: 'expand',
    position: 'top',
    closeOnOutsideClick: true,
    template() {
      const $list = $('<div>').addClass('panel-list dx-theme-typography-background-color');

      return $list.dxList({
        dataSource: navigation,
        hoverStateEnabled: false,
        focusStateEnabled: false,
        activeStateEnabled: false,
      });
    },
  }).dxDrawer('instance');

  $('#toolbar').dxToolbar({
    items: [{
      widget: 'dxButton',
      location: 'before',
      options: {
        icon: 'menu',
        stylingMode: 'text',
        onClick() {
          drawer.toggle();
        },
      },
    }],
  });

  $('#opened-state-mode').dxRadioGroup({
    items: ['push', 'shrink', 'overlap'],
    layout: 'horizontal',
    value: 'shrink',
    onValueChanged(e) {
      drawer.option('openedStateMode', e.value);
      $('#reveal-mode-option').css('visibility', e.value !== 'push' ? 'visible' : 'hidden');
    },
  });

  $('#position-mode').dxRadioGroup({
    items: ['top', 'bottom'],
    layout: 'horizontal',
    value: 'top',
    onValueChanged(e) {
      drawer.option('position', e.value);
    },
  });

  $('#reveal-mode').dxRadioGroup({
    items: ['slide', 'expand'],
    layout: 'horizontal',
    value: 'expand',
    onValueChanged(e) {
      drawer.option('revealMode', e.value);
    },
  });
});
