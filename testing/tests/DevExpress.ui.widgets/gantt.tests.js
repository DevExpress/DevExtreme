import $ from "jquery";
const { test } = QUnit;
import "common.css!";
import "ui/gantt";

QUnit.testStart(() => {
    const markup = '<div id="gantt"></div>';
    $("#qunit-fixture").html(markup);
});

const TREELIST_SELECTOR = ".dx-treelist";
const TASK_WRAPPER_SELECTOR = ".dx-gantt-taskWrapper";
const TASK_RESOURCES_SELECTOR = ".dx-gantt-taskRes";
const TASK_ARROW_SELECTOR = ".dx-gantt-arrow";
const SPLITTER_SELECTOR = ".dx-gantt-splitter";

const tasks = [
    { "id": 1, "parentId": 0, "title": "Software Development", "start": new Date("2019-02-21T05:00:00.000Z"), "end": new Date("2019-07-04T12:00:00.000Z"), "progress": 31 },
    { "id": 2, "parentId": 1, "title": "Scope", "start": new Date("2019-02-21T05:00:00.000Z"), "end": new Date("2019-02-26T09:00:00.000Z"), "progress": 60 },
    { "id": 3, "parentId": 2, "title": "Determine project scope", "start": new Date("2019-02-21T05:00:00.000Z"), "end": new Date("2019-02-21T09:00:00.000Z"), "progress": 100 },
    { "id": 4, "parentId": 2, "title": "Secure project sponsorship", "start": new Date("2019-02-21T10:00:00.000Z"), "end": new Date("2019-02-22T09:00:00.000Z"), "progress": 100 },
    { "id": 5, "parentId": 2, "title": "Define preliminary resources", "start": new Date("2019-02-22T10:00:00.000Z"), "end": new Date("2019-02-25T09:00:00.000Z"), "progress": 60 },
    { "id": 6, "parentId": 2, "title": "Secure core resources", "start": new Date("2019-02-25T10:00:00.000Z"), "end": new Date("2019-02-26T09:00:00.000Z"), "progress": 0 },
    { "id": 7, "parentId": 2, "title": "Scope complete", "start": new Date("2019-02-26T09:00:00.000Z"), "end": new Date("2019-02-26T09:00:00.000Z"), "progress": 0 }
];
const dependencies = [
    { "id": 0, "predecessorId": 1, "successorId": 2, "type": 0 },
    { "id": 1, "predecessorId": 2, "successorId": 3, "type": 0 },
    { "id": 2, "predecessorId": 3, "successorId": 4, "type": 0 },
    { "id": 3, "predecessorId": 4, "successorId": 5, "type": 0 },
    { "id": 4, "predecessorId": 5, "successorId": 6, "type": 0 },
    { "id": 5, "predecessorId": 6, "successorId": 7, "type": 0 }
];
const resources = [
    { 'id': 1, 'text': 'Management' },
    { 'id': 2, 'text': 'Project Manager' },
    { 'id': 3, 'text': 'Deployment Team' }
];
const resourceAssignments = [
    { "id": 0, "taskId": 3, "resourceId": 1 },
    { "id": 1, "taskId": 4, "resourceId": 1 },
    { "id": 2, "taskId": 5, "resourceId": 2 },
    { "id": 3, "taskId": 6, "resourceId": 2 },
    { "id": 4, "taskId": 6, "resourceId": 3 },
];
const tasksOnlyOptions = {
    tasks: { dataSource: tasks }
};
const allSourcesOptions = {
    tasks: { dataSource: tasks },
    dependencies: { dataSource: dependencies },
    resources: { dataSource: resources },
    resourceAssignments: { dataSource: resourceAssignments }
};

const moduleConfig = {
    beforeEach: () => {
        this.createInstance = (options) => {
            this.instance = this.$element.dxGantt(options).dxGantt("instance");
        };

        this.$element = $("#gantt");
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
};

QUnit.module("Options", moduleConfig, () => {
    test("should render task wrapper for each task", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const elements = this.$element.find(TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, tasks.length);
    });
    test("should render dependencies", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const element = this.$element.find(TASK_ARROW_SELECTOR);
        assert.equal(element.length, dependencies.length);
    });
    test("should render resources", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const element = this.$element.find(TASK_RESOURCES_SELECTOR);
        assert.equal(element.length, resourceAssignments.length);
    });

    test("treeListWidth", (assert) => {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const treeListElement = this.$element.find(TREELIST_SELECTOR)[0];
        const splitter = this.$element.find(SPLITTER_SELECTOR)[0];
        assert.equal(treeListElement.offsetWidth, 300);
        assert.equal(splitter.style.left, "300px");
        this.instance.option("treeListWidth", 500);
        assert.equal(treeListElement.offsetWidth, 500);
        assert.equal(splitter.style.left, "500px");
    });
});
