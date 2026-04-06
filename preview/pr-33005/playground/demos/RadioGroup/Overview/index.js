$(() => {
  $('#radio-group-simple').dxRadioGroup({
    items: priorities,
    value: priorities[0],
  });

  $('#radio-group-disabled').dxRadioGroup({
    items: priorities,
    value: priorities[1],
    disabled: true,
  });

  $('#radio-group-change-layout').dxRadioGroup({
    items: priorities,
    value: priorities[0],
    layout: 'horizontal',
  });

  $('#radio-group-with-template').dxRadioGroup({
    items: priorities,
    value: priorities[2],
    itemTemplate: (itemData, _, itemElement) => {
      itemElement.text(itemData);
    },
    onValueChanged: (e) => {
      const $element = $(e.element);
      const priorityClass = e.previousValue.toLowerCase();
      const newPriorityClass = e.value.toLowerCase();

      $element.removeClass(priorityClass);
      $element.addClass(newPriorityClass);
    },
  }).addClass(priorities[2].toLowerCase());

  const radioGroup = $('#radio-group-with-selection').dxRadioGroup({
    items: priorityEntities,
    valueExpr: 'id',
    displayExpr: 'text',
    onValueChanged(e) {
      $('#list').children().remove();
      $.each(tasks, (i, item) => {
        if (item.priority === e.value) {
          $('#list').append($('<li/>').text(tasks[i].subject));
        }
      });
    },
  }).dxRadioGroup('instance');

  radioGroup.option('value', priorityEntities[0].id);
});
