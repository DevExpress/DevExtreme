$(() => {
  const gantt = $('#gantt').dxGantt({
    taskTitlePosition: 'outside',
    scaleType: 'months',
    tasks: {
      dataSource: tasks,
    },
    startDateRange: new Date(2018, 11, 1),
    endDateRange: new Date(2019, 11, 1),
    dependencies: {
      dataSource: dependencies,
    },
    resources: {
      dataSource: resources,
    },
    resourceAssignments: {
      dataSource: resourceAssignments,
    },
    editing: {
      enabled: true,
    },
    columns: [{
      dataField: 'title',
      caption: 'Subject',
      width: 300,
    }, {
      dataField: 'start',
      caption: 'Start Date',
    }, {
      dataField: 'end',
      caption: 'End Date',
    }],
    taskListWidth: 500,
    taskTooltipContentTemplate: getTaskTooltipContentTemplate,
    taskProgressTooltipContentTemplate: getTaskProgressTooltipContentTemplate,
    taskTimeTooltipContentTemplate: getTaskTimeTooltipContentTemplate,

  }).dxGantt('instance');

  $('#scaleType').dxSelectBox({
    items: [
      'auto',
      'minutes',
      'hours',
      'days',
      'weeks',
      'months',
      'quarters',
      'years',
    ],
    value: 'months',
    onValueChanged(e) {
      gantt.option('scaleType', e.value);
    },
  });

  $('#titlePosition').dxSelectBox({
    items: [
      'inside',
      'outside',
      'none',
    ],
    value: 'outside',
    onValueChanged(e) {
      gantt.option('taskTitlePosition', e.value);
    },
  });

  $('#showResources').dxCheckBox({
    value: true,
    onValueChanged(e) {
      gantt.option('showResources', e.value);
    },
  });
  $('#showDependencies').dxCheckBox({
    value: true,
    onValueChanged(e) {
      gantt.option('showDependencies', e.value);
    },
  });

  $('#customizeTaskTooltip').dxCheckBox({
    value: true,
    onValueChanged(e) {
      gantt.option(
        'taskTooltipContentTemplate',
        e.value ? getTaskTooltipContentTemplate : undefined,
      );
      gantt.option(
        'taskProgressTooltipContentTemplate',
        e.value ? getTaskProgressTooltipContentTemplate : undefined,
      );
      gantt.option(
        'taskTimeTooltipContentTemplate',
        e.value ? getTaskTimeTooltipContentTemplate : undefined,
      );
    },
  });
  $('#startDateContainer').dxDateBox({
    type: 'date',
    value: new Date(2018, 11, 1),
    inputAttr: { 'aria-label': 'Start Date' },
    onValueChanged(e) {
      gantt.option('startDateRange', e.value);
    },
  });

  $('#endDateContainer').dxDateBox({
    type: 'date',
    value: new Date(2019, 11, 1),
    inputAttr: { 'aria-label': 'End Date' },
    onValueChanged(e) {
      gantt.option('endDateRange', e.value);
    },
  });

  function getTaskTooltipContentTemplate(task) {
    const timeEstimate = Math.abs(task.start - task.end) / 36e5;
    const timeLeft = Math.floor(((100 - task.progress) / 100) * timeEstimate);

    const $customTooltip = $(document.createElement('div'))
      .addClass('custom-task-edit-tooltip');

    $(document.createElement('div'))
      .addClass('custom-tooltip-title')
      .text(task.title)
      .appendTo($customTooltip);
    $(document.createElement('div'))
      .addClass('custom-tooltip-row')
      .text(`Estimate: ${timeEstimate} hours`)
      .appendTo($customTooltip);
    $(document.createElement('div'))
      .addClass('custom-tooltip-row')
      .text(`Left: ${timeLeft}hours`)
      .appendTo($customTooltip);

    return $customTooltip;
  }

  function getTaskProgressTooltipContentTemplate(task) {
    const $customTooltip = $(document.createElement('div'))
      .addClass('custom-task-edit-tooltip');

    $(document.createElement('div'))
      .addClass('custom-tooltip-title')
      .text(`${task.progress}%`)
      .appendTo($customTooltip);

    return $customTooltip;
  }

  function getTaskTimeTooltipContentTemplate(task) {
    const start = task.start.toLocaleString();
    const end = task.end.toLocaleString();

    const $customTooltip = $(document.createElement('div'))
      .addClass('custom-task-edit-tooltip');

    $(document.createElement('div'))
      .addClass('custom-tooltip-title')
      .text(`Start: ${start}`)
      .appendTo($customTooltip);
    $(document.createElement('div'))
      .addClass('custom-tooltip-title')
      .text(`End: ${end}`)
      .appendTo($customTooltip);

    return $customTooltip;
  }
});
