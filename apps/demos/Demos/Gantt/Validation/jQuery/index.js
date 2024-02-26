$(() => {
  const gantt = $('#gantt').dxGantt({
    validation: {
      autoUpdateParentTasks: true,
      validateDependencies: true,
      enablePredecessorGap: true,
    },

    tasks: {
      dataSource: tasks,
    },
    dependencies: {
      dataSource: dependencies,
    },
    editing: {
      enabled: true,
    },
    columns: [{
      dataField: 'title',
      caption: 'Task',
      width: 300,
    }, {
      dataField: 'start',
      caption: 'Start Date',
    }, {
      dataField: 'end',
      caption: 'End Date',
    }],
    taskListWidth: 500,
    taskTitlePosition: 'none',
  }).dxGantt('instance');

  $('#autoUpdateParentTasks').dxCheckBox({
    text: 'Auto Update Parent Tasks',
    value: true,
    onValueChanged(e) {
      gantt.option('validation.autoUpdateParentTasks', e.value);
    },
  });

  $('#validateDependencies').dxCheckBox({
    text: 'Enable Dependency Validation',
    value: true,
    onValueChanged(e) {
      gantt.option('validation.validateDependencies', e.value);
    },
  });

  $('#enablePredecessorGap').dxCheckBox({
    text: 'Enable Predecessor Gap',
    value: true,
    onValueChanged(e) {
      gantt.option('validation.enablePredecessorGap', e.value);
    },
  });
});
