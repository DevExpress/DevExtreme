$(() => {
  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: new DevExpress.data.ArrayStore({
      key: 'id',
      data,
    }),
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 11),
    startDayHour: 9,
    resources: [
      {
        fieldExpr: 'assigneeId',
        allowMultiple: true,
        dataSource: assignees,
        label: 'Assignee',
        useColorAsDefault: true,
        icon: 'user',
      }, {
        fieldExpr: 'priorityId',
        dataSource: priorities,
        label: 'Priority',
        icon: 'tags',
      }],
    editing: {
      form: {
        items: [{ name: 'mainGroup',
          items: [
            'subjectGroup',
            'dateGroup', 'repeatGroup', { name: 'resourcesGroup',
              items: [{
                name: 'assigneeIdGroup',
                colCount: 3,
                items: ['assigneeIdIcon', 'assigneeId', 'priorityId'],
              }] },
          ] }, 'recurrenceGroup'],
      },
    },
    height: 600,
  });
});
