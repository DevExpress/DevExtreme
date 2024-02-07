$(() => {
  const gantt = $('#gantt').dxGantt({
    rootValue: -1,
    tasks: {
      dataSource: tasks,
    },
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
      sortOrder: 'asc',
    }, {
      dataField: 'start',
      caption: 'Start Date',
    }, {
      dataField: 'end',
      caption: 'End Date',
    }],
    scaleType: 'weeks',
    taskListWidth: 500,
    sorting: {
      mode: 'single',
    },
  }).dxGantt('instance');

  $('#sortingMode').dxSelectBox({
    inputAttr: { 'aria-label': 'Sorting Mode' },
    items: [
      'single',
      'multiple',
      'none',
    ],
    value: 'single',
    onValueChanged(e) {
      gantt.option('sorting', { mode: e.value });
      const disabled = e.value !== 'multiple';
      $('#showSortIndexes').dxCheckBox('instance').option('disabled', disabled);
    },
  });

  $('#showSortIndexes').dxCheckBox({
    value: false,
    text: 'Show Sort Indexes',
    disabled: true,
    onValueChanged(e) {
      gantt.option('sorting', { showSortIndexes: e.value });
    },
  });
});
