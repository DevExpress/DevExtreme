$(() => {
  const statuses = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];

  renderKanban($('#kanban'), statuses);

  function renderKanban($container, statusList) {
    statusList.forEach((status) => {
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
      .appendTo($container);

    const employee = employees.filter((e) => e.ID === task.Task_Assigned_Employee_ID)[0];

    $('<div>').addClass('card-priority').addClass(`priority-${task.Task_Priority}`).appendTo($item);
    $('<div>').addClass('card-subject').text(task.Task_Subject).appendTo($item);
    $('<div>').addClass('card-assignee').text(employee.Name).appendTo($item);
  }
});
