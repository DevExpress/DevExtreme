$(() => {
  const statuses = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];

  renderKanban($('#kanban'), statuses);

  function renderKanban($container, statuses) {
    statuses.forEach((status) => {
      renderList($container, status);
    });

    $container.addClass('scrollable-board').dxScrollView({
      direction: 'horizontal',
      showScrollbar: 'always',
    });

    $container.addClass('sortable-lists').dxSortable({
      filter: '.list',
      itemOrientation: 'horizontal',
      handle: '.list-title',
      moveItemOnDrop: true,
    });
  }

  function renderList($container, status) {
    const $list = $('<div>').addClass('list').appendTo($container);

    renderListTitle($list, status);

    const listTasks = tasks.filter((task) => task.Task_Status === status);

    renderCards($list, listTasks);
  }

  function renderListTitle($container, status) {
    $('<div>')
      .addClass('list-title')
      .addClass('dx-theme-text-color')
      .text(status)
      .appendTo($container);
  }

  function renderCards($container, tasks) {
    const $scroll = $('<div>').appendTo($container);
    const $items = $('<div>').appendTo($scroll);

    tasks.forEach((task) => {
      renderCard($items, task);
    });

    $scroll.addClass('scrollable-list').dxScrollView({
      direction: 'vertical',
      showScrollbar: 'always',
    });

    $items.addClass('sortable-cards').dxSortable({
      group: 'tasksGroup',
      moveItemOnDrop: true,
    });
  }

  function renderCard($container, task) {
    const $item = $('<div>')
      .addClass('card')
      .addClass('dx-card')
      .addClass('dx-theme-text-color')
      .addClass('dx-theme-background-color')
      .appendTo($container);

    const employee = employees.filter((employee) => employee.ID === task.Task_Assigned_Employee_ID)[0];

    $('<div>').addClass('card-priority').addClass(`priority-${task.Task_Priority}`).appendTo($item);
    $('<div>').addClass('card-subject').text(task.Task_Subject).appendTo($item);
    $('<div>').addClass('card-assignee').text(employee.Name).appendTo($item);
  }
});
