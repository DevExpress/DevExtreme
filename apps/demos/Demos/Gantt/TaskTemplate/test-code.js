testUtils.importAnd(() => 'devextreme/ui/gantt', () => DevExpress.ui.dxGantt, (dxGantt) => {
  const currentDate = new Date('2021/04/27 15:00');
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const fakeTasks = [{
    id: 1,
    parentId: 0,
    title: 'Analysis/Software Requirements',
    start: new Date(year, month, 1),
    end: new Date(year, month, 28),
    progress: 31,
  }, {
    id: 2,
    parentId: 1,
    title: 'Conduct needs analysis',
    start: new Date(year, month, 1),
    end: new Date(year, month, 3),
    progress: 15,
  }, {
    id: 3,
    parentId: 1,
    title: 'Draft preliminary software specifications',
    start: new Date(year, month, 3),
    end: new Date(year, month, 5),
    progress: 30,
  }, {
    id: 4,
    parentId: 1,
    title: 'Review software specifications/budget with team',
    start: new Date(year, month, 4),
    end: new Date(year, month, 6),
    progress: 60,
  }, {
    id: 5,
    parentId: 1,
    title: 'Incorporate feedback on software specifications',
    start: new Date(year, month, 6),
    end: new Date(year, month, 8),
    progress: 45,
  }, {
    id: 6,
    parentId: 1,
    title: 'Develop delivery timeline',
    start: new Date(year, month, 8),
    end: new Date(year, month, 14),
    progress: 15,
  }, {
    id: 7,
    parentId: 1,
    title: 'Obtain approvals to proceed (concept, timeline, budget)',
    start: new Date(year, month, 14),
    end: new Date(year, month, 20),
    progress: 15,
  }, {
    id: 8,
    parentId: 1,
    title: 'Draft preliminary software specifications',
    start: new Date(year, month, 20),
    end: new Date(year, month, 25),
    progress: 0,
  }, {
    id: 9,
    parentId: 1,
    title: 'Secure required resources',
    start: new Date(year, month, 25),
    end: new Date(year, month, 28),
    progress: 0,
  }];

  fakeTasks.forEach((t) => {
    t.ID = t.id;
    t.ParentId = t.parentId;
    t.Title = t.title;
    t.Start = t.start;
    t.End = t.end;
    t.Progress = t.progress;
  });

  return testUtils
    .postponeUntilFound('.dx-gantt', 100, 10000)
    .then(() => {
      const instance = dxGantt.getInstance(document.querySelector('.dx-gantt'));
      if (instance) {
        instance.option('tasks', { dataSource: fakeTasks });
        instance.option('onContentReady', () => {
          instance.option = function () { };
        });
        instance.refresh();
      }
    })
    .then(() => testUtils.postpone(2000));
});
