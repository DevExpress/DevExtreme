window.onload = function () {
  const selectedResource = ko.observable(resourcesList[0]);

  const resources = ko.observableArray([
    {
      fieldExpr: 'roomId',
      dataSource: rooms,
      label: 'Room',
    }, {
      fieldExpr: 'priorityId',
      dataSource: priorities,
      label: 'Priority',
    }, {
      fieldExpr: 'assigneeId',
      allowMultiple: true,
      dataSource: assignees,
      label: 'Assignee',
    }]);

  const changeMainColor = function () {
    const resourcesData = resources();

    for (let i = 0; i < resourcesData.length; i += 1) {
      resourcesData[i].useColorAsDefault = resourcesData[i].label === selectedResource();
    }
    resources(resourcesData);
  };

  ko.computed(changeMainColor);

  const viewModel = {
    schedulerInstance: {
      dataSource: data,
      views: ['workWeek'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      endDayHour: 19,
      resources,
      height: 600,
    },
    resourcesSelectorOptions: {
      items: resourcesList,
      value: selectedResource,
      layout: 'horizontal',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('scheduler-demo'));
};
