import $ from 'jquery';
import 'ui/gantt';
import { options } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Mappings convert', moduleConfig, () => {
    test('Task data convert', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const tasksMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        const start = new Date('2019-02-11T05:00:00.000Z');
        const end = new Date('2019-02-14T05:00:00.000Z');
        const data = {
            title: 'custom text',
            start: start,
            end: end,
            progress: 31,
            color: 'red'
        };

        const mappedData = this.instance._mappingHelper.convertCoreToMappedData('tasks', data);
        assert.equal(mappedData['ItemName'], 'custom text', 'title was mapped');
        assert.equal(mappedData['SprintStartDate'], start, 'start was mapped');
        assert.equal(mappedData['SprintEndDate'], end, 'end was mapped');
        assert.equal(mappedData['TaskProgress'], 31, 'progress was mapped');
        assert.equal(mappedData['TaskColor'], 'red', 'color was mapped');

        const coreData = this.instance._mappingHelper.convertMappedToCoreData('tasks', mappedData);
        assert.equal(coreData['title'], 'custom text', 'title was mapped');
        assert.equal(coreData['start'], start, 'start was mapped');
        assert.equal(coreData['end'], end, 'end was mapped');
        assert.equal(coreData['progress'], 31, 'progress was mapped');
        assert.equal(coreData['color'], 'red', 'color was mapped');

        const fields = ['title', 'start', 'end', 'progress', 'color'];
        const mappedFields = this.instance._mappingHelper.convertCoreToMappedFields('tasks', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('ItemName') > -1, 'title was mapped');
        assert.ok(mappedFields.indexOf('SprintStartDate') > -1, 'start was mapped');
        assert.ok(mappedFields.indexOf('SprintEndDate') > -1, 'end was mapped');
        assert.ok(mappedFields.indexOf('TaskProgress') > -1, 'progress was mapped');
        assert.ok(mappedFields.indexOf('TaskColor') > -1, 'color was mapped');

        const coreFields = this.instance._mappingHelper.convertMappedToCoreFields('tasks', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('title') > -1, 'title in list');
        assert.ok(coreFields.indexOf('start') > -1, 'start in list');
        assert.ok(coreFields.indexOf('end') > -1, 'end in list');
        assert.ok(coreFields.indexOf('progress') > -1, 'progress in list');
        assert.ok(coreFields.indexOf('color') > -1, 'color in list');
    });
    test('Dependency data convert', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const dependencyMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            predecessorIdExpr: 'PredecessorTask',
            successorIdExpr: 'SuccessorTask',
            typeExpr: 'DependencyType',
        };

        this.instance.option('dependencies', dependencyMap);
        const data = { predecessorId: 3, successorId: 4, type: 0 };

        const mappedData = this.instance._mappingHelper.convertCoreToMappedData('dependencies', data);
        assert.equal(mappedData['PredecessorTask'], 3, 'predecessorId was mapped');
        assert.equal(mappedData['SuccessorTask'], 4, 'successorId was mapped');
        assert.equal(mappedData['DependencyType'], 0, 'type was mapped');

        const coreData = this.instance._mappingHelper.convertMappedToCoreData('dependencies', mappedData);
        assert.equal(coreData['predecessorId'], 3, 'predecessorId was mapped');
        assert.equal(coreData['successorId'], 4, 'successorId was mapped');
        assert.equal(coreData['type'], 0, 'type was mapped');

        const fields = ['predecessorId', 'successorId', 'type'];
        const mappedFields = this.instance._mappingHelper.convertCoreToMappedFields('dependencies', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('PredecessorTask') > -1, 'PredecessorTask was mapped');
        assert.ok(mappedFields.indexOf('SuccessorTask') > -1, 'SuccessorTask was mapped');
        assert.ok(mappedFields.indexOf('DependencyType') > -1, 'DependencyType was mapped');

        const coreFields = this.instance._mappingHelper.convertMappedToCoreFields('dependencies', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('predecessorId') > -1, 'predecessorId in list');
        assert.ok(coreFields.indexOf('successorId') > -1, 'successorId in list');
        assert.ok(coreFields.indexOf('type') > -1, 'type in list');
    });
    test('Resource data convert', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const resourceMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };

        this.instance.option('resources', resourceMap);
        const data = { text: 'My text', color: 'black' };

        const mappedData = this.instance._mappingHelper.convertCoreToMappedData('resources', data);
        assert.equal(mappedData['ResourceText'], 'My text', 'ResourceText was mapped');
        assert.equal(mappedData['ResourceColor'], 'black', 'ResourceColor was mapped');

        const coreData = this.instance._mappingHelper.convertMappedToCoreData('resources', mappedData);
        assert.equal(coreData['text'], 'My text', 'text was mapped');
        assert.equal(coreData['color'], 'black', 'color was mapped');

        const fields = ['text', 'color'];
        const mappedFields = this.instance._mappingHelper.convertCoreToMappedFields('resources', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('ResourceText') > -1, 'ResourceText was mapped');
        assert.ok(mappedFields.indexOf('ResourceColor') > -1, 'ResourceColor was mapped');

        const coreFields = this.instance._mappingHelper.convertMappedToCoreFields('resources', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('text') > -1, 'text in list');
        assert.ok(coreFields.indexOf('color') > -1, 'color in list');
    });
    test('Assignment data convert', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const assignmentMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };

        this.instance.option('resourceAssignments', assignmentMap);
        const data = { taskId: 1, resourceId: 2 };

        const mappedData = this.instance._mappingHelper.convertCoreToMappedData('resourceAssignments', data);
        assert.equal(mappedData['TaskKey'], 1, 'TaskKey was mapped');
        assert.equal(mappedData['ResourceKey'], 2, 'ResourceKey was mapped');

        const coreData = this.instance._mappingHelper.convertMappedToCoreData('resourceAssignments', mappedData);
        assert.equal(coreData['taskId'], 1, 'taskId was mapped');
        assert.equal(coreData['resourceId'], 2, 'resourceId was mapped');

        const fields = ['taskId', 'resourceId'];
        const mappedFields = this.instance._mappingHelper.convertCoreToMappedFields('resourceAssignments', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('TaskKey') > -1, 'TaskKey was mapped');
        assert.ok(mappedFields.indexOf('ResourceKey') > -1, 'ResourceKey was mapped');

        const coreFields = this.instance._mappingHelper.convertMappedToCoreFields('resourceAssignments', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('taskId') > -1, 'taskId in list');
        assert.ok(coreFields.indexOf('resourceId') > -1, 'resourceId in list');
    });
});
