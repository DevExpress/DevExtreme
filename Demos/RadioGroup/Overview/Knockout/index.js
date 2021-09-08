window.onload = function () {
  const viewModel = {
    simple: {
      items: priorities,
      value: priorities[0],
    },
    disabled: {
      items: priorities,
      value: priorities[1],
      disabled: true,
    },
    changeLayout: {
      items: priorities,
      value: priorities[0],
      layout: 'horizontal',
    },
    customItemTemplate: {
      items: priorities,
      value: priorities[2],
      itemTemplate(itemData, _, itemElement) {
        itemElement
          .parent().addClass(itemData.toLowerCase())
          .text(itemData);
      },
    },
    eventRadioGroupOptions: {
      items: priorityEntities,
      valueExpr: 'id',
      displayExpr: 'text',
      value: priorityEntities[0].id,
      onValueChanged(e) {
        viewModel.list(tasks.filter((item) => item.priority === e.value));
      },
    },
    list: ko.observableArray([tasks[1]]),
  };

  ko.applyBindings(viewModel, document.getElementById('radio-group-demo'));
};
