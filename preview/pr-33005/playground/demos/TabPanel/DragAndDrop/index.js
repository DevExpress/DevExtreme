$(() => {
  const tabPanel = $('#tabPanel').dxTabPanel({
    dataSource: employees.slice(0, 3),
    itemTitleTemplate: titleTemplate,
    itemTemplate,
    height: 410,
    deferRendering: false,
    showNavButtons: true,
    repaintChangesOnly: true,
  }).dxTabPanel('instance');

  $('#tabPanel').dxSortable({
    moveItemOnDrop: true,
    filter: '.dx-tab',
    itemOrientation: 'horizontal',
    dragDirection: 'horizontal',
    onReorder(e) {
      const tabPanelItems = tabPanel.option('dataSource');
      const itemData = tabPanelItems.splice(e.fromIndex, 1)[0];

      tabPanelItems.splice(e.toIndex, 0, itemData);
      tabPanel.option('dataSource', tabPanelItems);
      tabPanel.option('selectedIndex', e.toIndex);
    },
  });

  const addTabButton = $('#addButton').dxButton({
    icon: 'add',
    text: 'Add Tab',
    type: 'default',
    onClick: addButtonHandler,
  }).dxButton('instance');

  function titleTemplate(itemData, itemIndex, itemElement) {
    itemElement
      .append($('<span>').text(`${itemData.FirstName} ${itemData.LastName}`));

    if (!itemData.isLast) {
      itemElement
        .append(
          $('<i>')
            .addClass('dx-icon')
            .addClass('dx-icon-close')
            .click(() => { closeButtonHandler(itemData); }),
        );
    }
  }

  function itemTemplate(itemData, itemIndex, itemElement) {
    $('<div>')
      .addClass('employeeInfo')
      .append($(`<img alt="${itemData.FirstName} ${itemData.LastName}" class="employeePhoto" src="${itemData.Picture}"/>`))
      .append($('<p>').addClass('employeeNotes').append($(`<b>Position: ${itemData.Position}</b><br/>`)).append(itemData.Notes))
      .appendTo(itemElement);

    $('<div>')
      .addClass('caption')
      .text(`${itemData.FirstName} ${itemData.LastName}'s Tasks:`)
      .appendTo(itemElement);

    const employeeTasks = tasks.filter((task) => task.EmployeeID === itemData.ID);

    $('<div>')
      .addClass('task-list')
      .appendTo(itemElement)
      .dxList({
        dataSource: employeeTasks,
        selectionMode: 'multiple',
        showSelectionControls: true,
        disabled: true,
        selectedItems: employeeTasks.filter((task) => task.Status === 'Completed'),
        itemTemplate(data) {
          return $(`<div>${data.Subject}</div>`);
        },
      });
  }

  function addButtonHandler() {
    const tabPanelItems = tabPanel.option('dataSource');
    const newItem = employees.filter((employee) => tabPanelItems.indexOf(employee) === -1)[0];

    tabPanelItems.push(newItem);

    updateButtonsState(tabPanelItems);

    tabPanel.option('dataSource', tabPanelItems);
    tabPanel.option('selectedIndex', tabPanelItems.length - 1);
  }

  function closeButtonHandler(itemData) {
    const index = tabPanel.option('dataSource').indexOf(itemData);
    const tabPanelItems = tabPanel.option('dataSource');
    tabPanelItems.splice(index, 1);

    updateButtonsState(tabPanelItems);

    tabPanel.option('dataSource', tabPanelItems);
    if (index >= tabPanelItems.length && index > 0) tabPanel.option('selectedIndex', index - 1);
  }

  function updateButtonsState(items) {
    addTabButton.option('disabled', items.length === employees.length);
    items[0].isLast = items.length === 1;
  }
});
