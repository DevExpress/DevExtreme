$(() => {
  for (let i = 0; i < tasks.length; i += 1) {
    $('<div>')
      .text(tasks[i].Task_Subject)
      .addClass('item dx-card dx-theme-background-color dx-theme-text-color')
      .appendTo('#list');
  }

  const sortable = $('#list').dxSortable({
    moveItemOnDrop: true,
  }).dxSortable('instance');

  const scrollView = $('#scroll').dxScrollView({
    showScrollbar: 'always',
  }).dxScrollView('instance');

  $('#item-orientation').dxSelectBox({
    items: ['vertical', 'horizontal'],
    value: 'vertical',
    onValueChanged(e) {
      $('#scroll').toggleClass('horizontal', e.value === 'horizontal');
      sortable.option('itemOrientation', e.value);
      scrollView.option('direction', e.value);
      $('#drag-direction').dxSelectBox({
        value: 'both',
        items: ['both', e.value],
      });
    },
  });

  $('#drag-direction').dxSelectBox({
    items: ['both', 'vertical'],
    value: 'both',
    onValueChanged(e) {
      sortable.option('dragDirection', e.value);
    },
  });

  $('#drop-feedback-mode').dxSelectBox({
    items: ['push', 'indicate'],
    value: 'push',
    onValueChanged(e) {
      sortable.option('dropFeedbackMode', e.value);
    },
  });

  $('#scroll-speed').dxNumberBox({
    value: 30,
    inputAttr: { 'aria-label': 'Scroll Speed' },
    onValueChanged(e) {
      sortable.option('scrollSpeed', e.value);
    },
  });

  $('#scroll-sensitivity').dxNumberBox({
    value: 60,
    inputAttr: { 'aria-label': 'Scroll Sensitivity' },
    onValueChanged(e) {
      sortable.option('scrollSensitivity', e.value);
    },
  });

  $('#handle').dxCheckBox({
    text: 'Use Handle',
    value: false,
    onValueChanged(e) {
      if (e.value) {
        $('.item').append("<i class='dx-icon dx-icon-dragvertical handle'></i>");
      } else {
        $('.item').children('i').remove();
      }
      $('.item').toggleClass('item-with-handle', e.value);
      sortable.option('handle', e.value ? '.handle' : '');
    },
  });

  const dragTemplate = function (options) {
    return $('<div>')
      .addClass('item dx-card dx-theme-background-color dx-theme-text-color')
      .css({
        width: 200,
        padding: 10,
        fontWeight: 'bold',
      })
      .text(options.itemElement.text());
  };

  $('#template').dxCheckBox({
    text: 'Use Drag Template',
    value: false,
    onValueChanged(e) {
      sortable.option('dragTemplate', e.value ? dragTemplate : null);
      sortable.option('cursorOffset', e.value ? { x: 10, y: 20 } : null);
    },
  });
});
