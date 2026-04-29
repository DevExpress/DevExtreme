$(() => {
  $('#gantt').dxGantt({
    toolbar: {
      items: [
        'undo',
        'redo',
        'separator',
        'collapseAll',
        'expandAll',
        'separator',
        'addTask',
        'deleteTask',
        'separator',
        'zoomIn',
        'zoomOut',
        'separator',
        'showResources',
        'showDependencies',
        'separator',
        {
          widget: 'dxButton',
          options: {
            text: 'About',
            icon: 'info',
            stylingMode: 'text',
            onClick() {
              popupInstance.show();
            },
          },
        },
      ],
    },

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
    }, {
      dataField: 'start',
      caption: 'Start Date',
    }, {
      dataField: 'end',
      caption: 'End Date',
    }],
    scaleType: 'weeks',
    taskListWidth: 500,
  });

  const popupInstance = $('#popup').dxPopup({
    showTitle: true,
    title: 'About',
    height: 'auto',
  }).dxPopup('instance');
});
