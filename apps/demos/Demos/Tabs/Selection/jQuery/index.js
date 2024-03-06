$(() => {
  const tabsInstance = $('.tabs-container').dxTabs({
    dataSource: employees,
    selectedItem: employees[0],

    onSelectionChanged({ component }) {
      const { selectedItem } = component.option();

      selectBox.option({ value: selectedItem });
      multiView.option({ selectedItem });
    },
  }).dxTabs('instance');

  const selectBox = $('#selectbox').dxSelectBox({
    value: employees[0],
    dataSource: employees,
    inputAttr: { 'aria-label': 'Select Employee' },
    displayExpr: 'text',
    onValueChanged({ value }) {
      tabsInstance.option('selectedItem', value);
    },
  }).dxSelectBox('instance');

  const multiView = $('#multiview').dxMultiView({
    height: 112,
    width: '100%',
    dataSource: employees,
    selectedItem: employees[0],
    loop: false,
    animationEnabled: true,
    itemTemplate(data, index, element) {
      const $note = $('<div>')
        .addClass('employee-info')
        .append($(`<img alt="${data.text}" class="employee-photo" src="${data.picture}"/>`))
        .append($('<p>').addClass('employee-notes').append($(`<b>Position: ${data.position}</b><br/>`)).append(data.notes));

      element.append($note);
    },
    onSelectionChanged({ component }) {
      const { selectedItem } = component.option();

      tabsInstance.option({ selectedItem });
    },
  }).dxMultiView('instance');
});
