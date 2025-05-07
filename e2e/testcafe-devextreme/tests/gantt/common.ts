/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { appendElementTo } from '../../helpers/domUtils';

const TOOLBAR_ITEM_BUTTON = '.dx-button';

fixture.disablePageReloads`Gantt`
  .page(url(__dirname, '../container.html'));

const data = {
  tasks: [{
    id: 1,
    parentId: 0,
    title: 'Software Development',
    start: new Date('2019-02-21T05:00:00.000Z'),
    end: new Date('2019-07-04T12:00:00.000Z'),
    progress: 31,
    color: 'red',
  }, {
    id: 2,
    parentId: 1,
    title: 'Scope',
    start: new Date('2019-02-21T05:00:00.000Z'),
    end: new Date('2019-02-26T09:00:00.000Z'),
    progress: 60,
  }, {
    id: 3,
    parentId: 2,
    title: 'Determine project scope',
    start: new Date('2019-02-21T05:00:00.000Z'),
    end: new Date('2019-02-21T09:00:00.000Z'),
    progress: 100,
  }, {
    id: 4,
    parentId: 2,
    title: 'Secure project sponsorship',
    start: new Date('2019-02-21T10:00:00.000Z'),
    end: new Date('2019-02-22T09:00:00.000Z'),
    progress: 100,
  }, {
    id: 5,
    parentId: 2,
    title: 'Define preliminary resources',
    start: new Date('2019-02-22T10:00:00.000Z'),
    end: new Date('2019-02-25T09:00:00.000Z'),
    progress: 60,
  }, {
    id: 6,
    parentId: 2,
    title: 'Secure core resources',
    start: new Date('2019-02-25T10:00:00.000Z'),
    end: new Date('2019-02-26T09:00:00.000Z'),
    progress: 0,
  }, {
    id: 7,
    parentId: 2,
    title: 'Scope complete',
    start: new Date('2019-02-26T09:00:00.000Z'),
    end: new Date('2019-02-26T09:00:00.000Z'),
    progress: 0,
  }],

  dependencies: [{
    id: 0,
    predecessorId: 1,
    successorId: 2,
    type: 0,
  }, {
    id: 1,
    predecessorId: 2,
    successorId: 3,
    type: 0,
  }, {
    id: 2,
    predecessorId: 3,
    successorId: 4,
    type: 0,
  }, {
    id: 3,
    predecessorId: 4,
    successorId: 5,
    type: 0,
  }, {
    id: 4,
    predecessorId: 5,
    successorId: 6,
    type: 0,
  }, {
    id: 5,
    predecessorId: 6,
    successorId: 7,
    type: 0,
  }],

  resources: [{
    id: 1, text: 'Management',
  }, {
    id: 2, text: 'Project Manager',
  }, {
    id: 3, text: 'Deployment Team',
  }],

  resourceAssignments: [{
    id: 0, taskId: 3, resourceId: 1,
  }, {
    id: 1, taskId: 4, resourceId: 1,
  }, {
    id: 2, taskId: 5, resourceId: 2,
  }, {
    id: 3, taskId: 6, resourceId: 2,
  }, {
    id: 4, taskId: 6, resourceId: 3,
  }],
};

test('Gantt - show resources button should not have focus state (T1264485)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .click(Selector(TOOLBAR_ITEM_BUTTON));
  await testScreenshot(t, takeScreenshot, 'Gantt show resourced.png', { element: '#container' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const id = `${new Guid()}`;
  await appendElementTo('#container', 'div', id, {});
  await createWidget('dxGantt', {
    tasks: { dataSource: data.tasks },
    toolbar: { items: ['showResources'] },
    dependencies: { dataSource: data.dependencies },
    resources: { dataSource: data.resources },
    resourceAssignments: { dataSource: data.resourceAssignments },
  }, `#${id}`);
});

test('Gantt - show dependencies button should not have focus state (T1264485)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .click(Selector(TOOLBAR_ITEM_BUTTON));
  await testScreenshot(t, takeScreenshot, 'Gantt show dependencies.png', { element: '#container' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const id = `${new Guid()}`;
  await appendElementTo('#container', 'div', id, {});
  await createWidget('dxGantt', {
    tasks: { dataSource: data.tasks },
    toolbar: { items: ['showDependencies'] },
    dependencies: { dataSource: data.dependencies },
    resources: { dataSource: data.resources },
    resourceAssignments: { dataSource: data.resourceAssignments },
  }, `#${id}`);
});
