import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Edit api', moduleConfig, () => {
    test('task insert', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const taskData = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
            parentId: 2
        };

        const tasksCount = data.tasks.length;
        this.instance.insertTask(taskData);
        this.clock.tick();

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, taskData.title, 'new task title is right');
        assert.equal(createdTask.start, taskData.start, 'new task start is right');
        assert.equal(createdTask.end, taskData.end, 'new task end is right');
        assert.equal(createdTask.parentId, taskData.parentId, 'new task parentId is right');
    });
    test('task insert to root', function(assert) {
        const myTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
            { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
            { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
        ];
        const options = {
            tasks: { dataSource: myTasks },
            editing: { enabled: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const data = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
            parentId: 0
        };

        const tasksCount = myTasks.length;
        this.instance.insertTask(data);
        this.clock.tick();

        assert.equal(myTasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = myTasks[myTasks.length - 1];
        assert.equal(createdTask.parentId, data.parentId, 'new task parentId is right');
    });
    test('task delete', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = data.tasks.length;
        const taskToDelete = data.tasks[tasksCount - 1];
        this.instance.deleteTask(taskToDelete.id);
        this.clock.tick();

        assert.equal(data.tasks.length, tasksCount - 1, 'new task was deleted');
        const removedTask = data.tasks.filter((t) => t.id === taskToDelete.id)[0];
        assert.equal(removedTask, undefined, 'task was removed');
    });
    test('taskUpdate', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const taskToUpdate = data.tasks[0];
        const taskData = {
            title: 'New',
            start: new Date('2019-02-25'),
            end: new Date('2019-02-26'),
            progress: 73
        };

        this.instance.updateTask(taskToUpdate.id, taskData);
        this.clock.tick();

        assert.equal(taskToUpdate.title, taskData.title, 'task title is updated');
        assert.equal(taskToUpdate.start, taskData.start, 'new task start is updated');
        assert.equal(taskToUpdate.end, taskData.end, 'new task end is updated');
        assert.equal(taskToUpdate.progress, taskData.progress, 'new task progress is updated');
    });
    test('taskUpdate with custom and core fields', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);

        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);
        this.clock.tick();

        const data = {
            ItemName: 'New',
            CustomText: 'new text'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick();

        assert.equal(task.ItemName, data.ItemName, 'task title is updated');
        assert.equal(task.CustomText, data.CustomText, 'task cust field  is updated');
    });
    test('update task color and title in auto parent mode (T976669, T978287)', function(assert) {
        const tasks = [ {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text 1',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        },
        {
            Id: 2,
            ParentId: 1,
            ItemName: 'custom text 2',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        },
        ];
        const tasksMap = {
            dataSource: tasks,
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        const options = {
            tasks: tasksMap,
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true },
            columns: [{ dataField: 'ItemName', caption: 'Task' }]
        };
        this.createInstance(options);
        this.clock.tick();

        const data = {
            ItemName: 'New',
            TaskColor: 'yellow'
        };
        this.instance.updateTask(1, data);
        this.clock.tick();

        const firstTreeListTitleText = $(this.instance._treeList.getCellElement(0, 0)).text();
        assert.equal(firstTreeListTitleText, data.ItemName, 'title text was modified');
        assert.equal(tasks[0].ItemName, data.ItemName, 'task title is updated');
        assert.equal(tasks[0].TaskColor, data.TaskColor, 'task color  is updated');
    });
    test('taskUpdate with only custom field', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        let values;
        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.instance.option('onTaskUpdated', (e) => { values = e.values; });
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);
        this.clock.tick();

        const data = {
            CustomText: 'new text'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick(300);

        assert.equal(task.CustomText, data.CustomText, 'task cust field  is updated');
        assert.equal(task.CustomText, values.CustomText, 'onTaskUpdated is triggrered');
    });
    test('insertDependency', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = data.dependencies.length;
        const dependencyData = { 'predecessorId': 2, 'successorId': 4, 'type': 0 };
        this.instance.insertDependency(dependencyData);
        this.clock.tick();

        assert.equal(data.dependencies.length, count + 1, 'new dependency was not created');
        const createdDependency = data.dependencies[data.dependencies.length - 1];
        assert.equal(createdDependency.predecessorId, dependencyData.predecessorId, 'new predecessorId is right');
        assert.equal(createdDependency.successorId, dependencyData.successorId, 'new successorId is right');
        assert.equal(createdDependency.type, dependencyData.type, 'new type is right');
    });
    test('deleteDependency', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = data.dependencies.length;
        const dependencyToDelete = data.dependencies[count - 1];
        this.instance.deleteDependency(dependencyToDelete.id);
        this.clock.tick();

        const $confirmDialog = $('body').find(Consts.POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick();

        assert.equal(data.dependencies.length, count - 1, 'new dependency was deleted');
        const removedDependency = data.dependencies.filter((t) => t.id === dependencyToDelete.id)[0];
        assert.equal(removedDependency, undefined, 'dependency was removed');
    });
    test('insertResource + onResourceInserted', function(assert) {
        let values;
        let keyExists = false;
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceInserted', (e) => {
            values = e.values;
            keyExists = !!e.key;
        });
        this.clock.tick();

        const resourcesCount = data.resources.length;
        const assignmentsCount = data.resourceAssignments.length;
        const resourceData = { text: 'My text' };
        this.instance.insertResource(resourceData, [2]);
        this.clock.tick();

        assert.equal(data.resources.length, resourcesCount + 1, 'new resource was created');
        assert.equal(data.resourceAssignments.length, assignmentsCount + 1, 'new assignment was created');
        const newResource = data.resources[data.resources.length - 1];
        assert.equal(newResource.text, 'My text', 'new resource text is right');
        const newAssignment = data.resourceAssignments[data.resourceAssignments.length - 1];
        assert.equal(newAssignment.resourceId, newResource.id, 'new assignment resource id is right');
        assert.equal(newAssignment.taskId, 2, 'new assignment task id is right');

        assert.ok(keyExists, 'key created');
        assert.equal(values.text, resourceData.text, 'new task title is right');
    });
    test('insertResource (T959410)', function(assert) {
        let assignedValues;
        let assigningValues;
        let resKey;
        let assignmentKey;

        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceAssigning', (e) => { assigningValues = e.values; });
        this.instance.option('onResourceInserted', (e) => { resKey = e.key; });
        this.instance.option('onResourceAssigned', (e) => {
            assignedValues = e.values;
            assignmentKey = !!e.key;
        });
        this.clock.tick();

        const data = { text: 'My text' };
        this.instance.insertResource(data, [2]);
        this.clock.tick();

        assert.ok(assignmentKey, 'key created');
        assert.equal(assigningValues.taskId, 2, 'assigning task key');
        assert.equal(assigningValues.resourceId, resKey, 'assigning resource key');
        assert.equal(assignedValues.taskId, 2, 'assigned task key');
        assert.equal(assignedValues.resourceId, resKey, 'assigned resource key');
    });
    test('insertResource + assignResourceToTask (T959410)', function(assert) {
        let assignedValues;
        let assigningValues;
        let resKey;
        let assignmentKey;

        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceAssigning', (e) => { assigningValues = e.values; });
        this.instance.option('onResourceInserted', (e) => { resKey = e.key; });
        this.instance.option('onResourceAssigned', (e) => {
            assignedValues = e.values;
            assignmentKey = !!e.key;
        });
        this.clock.tick();

        const data = { text: 'My text' };
        this.instance.insertResource(data);
        this.clock.tick(200);
        this.instance.assignResourceToTask(resKey, 2);
        this.clock.tick(200);

        assert.ok(assignmentKey, 'key created');
        assert.equal(assigningValues.taskId, 2, 'assigning task key');
        assert.equal(assigningValues.resourceId, resKey, 'assigning resource key');
        assert.equal(assignedValues.taskId, 2, 'assigned task key');
        assert.equal(assignedValues.resourceId, resKey, 'assigned resource key');
    });
    test('deleteResource + onResourceDeleted', function(assert) {
        let key;
        let values;

        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceDeleted', (e) => {
            key = e.key;
            values = e.values;
        });
        this.clock.tick();

        const count = data.resources.length;
        const resourceToDelete = data.resources[count - 1];
        this.instance.deleteResource(resourceToDelete.id);
        this.clock.tick();

        assert.equal(data.resources.length, count - 1, 'resources was deleted');
        const removedResource = data.resources.filter((t) => t.id === resourceToDelete.id)[0];
        assert.equal(removedResource, undefined, 'dependency was removed');
        assert.equal(key, resourceToDelete.id, 'check key');
        assert.equal(values.text, resourceToDelete.text, 'check key');
    });
    test('assignResourceToTask', function(assert) {
        let values;
        let keyExists = false;
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceAssigned', (e) => {
            values = e.values;
            keyExists = !!e.key;
        });
        this.clock.tick();

        const count = data.resourceAssignments.length;
        const taskToAssign = data.tasks[data.tasks.length - 1];
        const resourceToAssign = data.resources[data.resources.length - 1];
        this.instance.assignResourceToTask(resourceToAssign.id, taskToAssign.id);
        this.clock.tick();

        assert.equal(data.resourceAssignments.length, count + 1, 'resource was assigned');
        const newAssignment = data.resourceAssignments[data.resourceAssignments.length - 1];
        assert.equal(newAssignment.resourceId, resourceToAssign.id, 'new assignment resource id is right');
        assert.equal(newAssignment.taskId, taskToAssign.id, 'new assignment task id is right');

        assert.ok(keyExists, 'key created');
        assert.equal(values.resourceId, resourceToAssign.id, 'new resource id in event');
        assert.equal(values.taskId, taskToAssign.id, 'new task id in event');
    });
    test('unassignResourceFromTask', function(assert) {
        let values;
        let key;
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceUnassigned', (e) => {
            values = e.values;
            key = e.key;
        });
        this.clock.tick();

        const count = data.resourceAssignments.length;
        const toDelete = data.resourceAssignments[count - 1];
        // eslint-disable-next-line spellcheck/spell-checker
        this.instance.unassignResourceFromTask(toDelete.resourceId, toDelete.taskId);
        this.clock.tick();

        assert.equal(data.resourceAssignments.length, count - 1, 'resource was not deassigned');
        const removedAssignment = data.resourceAssignments.filter((t) => t.id === toDelete.id)[0];
        assert.equal(removedAssignment, undefined, 'assigmnent was removed');

        assert.equal(key, toDelete.id, 'check key');
        assert.equal(values.resourceId, toDelete.resourceId, 'resource id in event');
        assert.equal(values.taskId, toDelete.taskId, 'task id in event');
    });
    test('getTaskData', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.clock.tick();

        const taskData = this.instance.getTaskData(1);
        assert.equal(taskData['ItemName'], task['ItemName'], 'title');
        assert.equal(taskData['SprintStartDate'], task['SprintStartDate'], 'start');
        assert.equal(taskData['SprintEndDate'], task['SprintEndDate'], 'end');
        assert.equal(taskData['TaskProgress'], task['TaskProgress'], 'progress');
    });
    test('getDependencyData', function(assert) {
        const dependency = {
            Id: 1,
            PredecessorTask: 1,
            SuccessorTask: 4,
            DependencyType: 0,
        };
        const dependencyMap = {
            dataSource: [ dependency ],
            keyExpr: 'Id',
            predecessorIdExpr: 'PredecessorTask',
            successorIdExpr: 'SuccessorTask',
            typeExpr: 'DependencyType',
        };
        this.createInstance(options.tasksOnlyOptions);
        this.instance.option('dependencies', dependencyMap);
        this.clock.tick();

        const dependencyData = this.instance.getDependencyData(1);
        this.clock.tick();
        assert.equal(dependencyData['PredecessorTask'], dependency['PredecessorTask'], 'PredecessorTask');
        assert.equal(dependencyData['SuccessorTask'], dependency['SuccessorTask'], 'SuccessorTask');
        assert.equal(dependencyData['DependencyType'], dependency['DependencyType'], 'DependencyType');
    });
    test('getResourceData', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const resource = { Id: 1, ResourceText: 'My text', ResourceColor: 'black' };
        const resourceMap = {
            dataSource: [ resource ],
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };
        this.instance.option('resources', resourceMap);
        this.clock.tick();

        const resourceData = this.instance.getResourceData(1);
        assert.equal(resourceData['ResourceText'], resource['ResourceText'], 'ResourceText');
        assert.equal(resourceData['ResourceColor'], resource['ResourceColor'], 'ResourceColor');
    });
    test('getResourceAssignmentData', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const assignment = { Id: 1, TaskKey: 1, ResourceKey: 2 };
        const assignmentMap = {
            dataSource: [ assignment ],
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };
        this.instance.option('resourceAssignments', assignmentMap);
        this.clock.tick();

        const assignmentData = this.instance.getResourceAssignmentData(1);
        assert.equal(assignmentData['TaskKey'], assignment['TaskKey'], 'TaskKey');
        assert.equal(assignmentData['ResourceKey'], assignment['ResourceKey'], 'ResourceKey');
    });
    test('getTaskResources', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const resources = [
            { Id: 1, ResourceText: 'My text', ResourceColor: 'black' },
            { Id: 2, ResourceText: 'My text2', ResourceColor: 'black' }
        ];
        const resourceMap = {
            dataSource: resources,
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };
        const assignments = [
            { Id: 1, TaskKey: 1, ResourceKey: 1 },
            { Id: 2, TaskKey: 1, ResourceKey: 2 }
        ];
        const assignmentMap = {
            dataSource: assignments,
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };
        this.instance.option('resources', resourceMap);
        this.instance.option('resourceAssignments', assignmentMap);
        this.clock.tick();

        const taskResources = this.instance.getTaskResources(1);
        assert.equal(taskResources.length, 2, 'length');
        assert.equal(taskResources[0]['ResourceText'], resources[0]['ResourceText'], 'ResourceText 1');
        assert.equal(taskResources[1]['ResourceText'], resources[1]['ResourceText'], 'ResourceText 2');
    });
    test('getVisibleKeys', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
            { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
            { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
        ];
        const my_dependencies = [
            { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 },
            { 'id': 1, 'predecessorId': 2, 'successorId': 3, 'type': 0 },
            { 'id': 2, 'predecessorId': 3, 'successorId': 4, 'type': 0 },
            { 'id': 3, 'predecessorId': 4, 'successorId': 5, 'type': 0 },
            { 'id': 4, 'predecessorId': 5, 'successorId': 6, 'type': 0 },
            { 'id': 5, 'predecessorId': 6, 'successorId': 7, 'type': 0 }
        ];
        const my_resources = [
            { 'id': 1, 'text': 'Management' },
            { 'id': 2, 'text': 'Project Manager' },
            { 'id': 3, 'text': 'Deployment Team' }
        ];
        const my_resourceAssignments = [
            { 'id': 0, 'taskId': 3, 'resourceId': 1 },
            { 'id': 1, 'taskId': 4, 'resourceId': 1 },
            { 'id': 2, 'taskId': 5, 'resourceId': 2 },
            { 'id': 3, 'taskId': 6, 'resourceId': 2 },
            { 'id': 4, 'taskId': 6, 'resourceId': 3 },
        ];

        const my_allSourcesOptions = {
            tasks: { dataSource: my_tasks },
            dependencies: { dataSource: my_dependencies },
            resources: { dataSource: my_resources },
            resourceAssignments: { dataSource: my_resourceAssignments }
        };

        this.createInstance(my_allSourcesOptions);
        this.clock.tick();

        assert.equal(this.instance.getVisibleTaskKeys().length, my_tasks.length, 'task keys');
        assert.equal(this.instance.getVisibleDependencyKeys().length, my_dependencies.length, 'dependencies keys');
        assert.equal(this.instance.getVisibleResourceKeys().length, my_resources.length, 'resources keys');
        assert.equal(this.instance.getVisibleResourceAssignmentKeys().length, my_resourceAssignments.length, 'resource assignments keys');

        this.instance.option('tasks', { dataSource: [] });
        this.instance.option('dependencies', { dataSource: [] });
        this.instance.option('resources', { dataSource: [] });
        this.instance.option('resourceAssignments', { dataSource: [] });
        this.clock.tick();

        assert.equal(this.instance.getVisibleTaskKeys().length, 0, 'task keys');
        assert.equal(this.instance.getVisibleDependencyKeys().length, 0, 'dependencies keys');
        assert.equal(this.instance.getVisibleResourceKeys().length, 0, 'resources keys');
        assert.equal(this.instance.getVisibleResourceAssignmentKeys().length, 0, 'resource assignments keys');
    });
    test('double task insert - check infinite loop on selection (T980191)', function(assert) {
        const myTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
            { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
            { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
        ];
        const options = {
            tasks: { dataSource: myTasks },
            editing: { enabled: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const data = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
            parentId: 2
        };

        const tasksCount = myTasks.length;
        this.instance.insertTask(data);
        this.instance.insertTask(data);
        this.clock.tick();
        assert.equal(myTasks.length, tasksCount + 2, 'new task was created in ds');
    });
});
