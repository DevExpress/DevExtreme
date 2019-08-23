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
const TASK_TITLE_IN_SELECTOR = ".dx-gantt-titleIn";
const TASK_TITLE_OUT_SELECTOR = ".dx-gantt-titleOut";
const TREELIST_EXPANDED = ".dx-treelist-expanded";
const TREELIST_COLLAPSED = ".dx-treelist-collapsed";

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

QUnit.module("Markup", moduleConfig, () => {
    test("should render treeList", (assert) => {
        this.createInstance(tasksOnlyOptions);
        const treeListElements = this.$element.find(TREELIST_SELECTOR);
        assert.ok(treeListElements.length === 1);
    });
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
});

QUnit.module("Options", moduleConfig, () => {
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
    test("showResources", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, resourceAssignments.length);
        this.instance.option("showResources", false);
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, 0);
        this.instance.option("showResources", true);
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, resourceAssignments.length);
    });
    test("taskTitlePosition", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const milestoneCount = tasks.reduce((count, t) => {
            return t.start.getTime() === t.end.getTime() ? count + 1 : count;
        }, 0);
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, tasks.length - milestoneCount);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option("taskTitlePosition", 'none');
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option("taskTitlePosition", 'outside');
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, tasks.length);
    });
    test("expr", (assert) => {
        const tasksDS = [
            { "i": 1, "pid": 0, "t": "Software Development", "s": new Date("2019-02-21T05:00:00.000Z"), "e": new Date("2019-07-04T12:00:00.000Z"), "p": 31 },
            { "i": 2, "pid": 1, "t": "Scope", "s": new Date("2019-02-21T05:00:00.000Z"), "e": new Date("2019-02-26T09:00:00.000Z"), "p": 60 },
            { "i": 3, "pid": 2, "t": "Determine project scope", "s": new Date("2019-02-21T05:00:00.000Z"), "e": new Date("2019-02-21T09:00:00.000Z"), "p": 100 }
        ];
        const dependenciesDS = [{ "i": 0, "pid": 1, "sid": 2, "t": 0 }];
        const resourcesDS = [{ "i": 1, "t": "Management" }];
        const resourceAssignmentsDS = [{ "i": 0, "tid": 3, "rid": 1 }];
        const options = {
            tasks: {
                dataSource: tasksDS,
                keyExpr: "i",
                parentIdExpr: "pid",
                startExpr: "s",
                endExpr: "e",
                progressExpr: "p",
                titleExpr: "t",
            },
            dependencies: {
                dataSource: dependenciesDS,
                keyExpr: "i",
                predecessorIdExpr: "pid",
                successorIdExpr: "sid",
                typeExpr: "t",
            },
            resources: {
                dataSource: resourcesDS,
                keyExpr: "i",
                textExpr: "t"
            },
            resourceAssignments: {
                dataSource: resourceAssignmentsDS,
                keyExpr: "i",
                taskIdExpr: "tid",
                resourceIdExpr: "rid"
            }
        };
        this.createInstance(options);
        this.clock.tick();
        const taskWrapperElements = this.$element.find(TASK_WRAPPER_SELECTOR);
        assert.equal(taskWrapperElements.length, tasksDS.length);
        const firstTitle = taskWrapperElements.first().children().children().first().text();
        assert.equal(firstTitle, tasksDS[0].t);
        const firstProgressElement = taskWrapperElements.first().children().children().last();
        assert.ok(firstProgressElement.width() > 0);

        const dependencyElements = this.$element.find(TASK_ARROW_SELECTOR);
        assert.equal(dependencyElements.length, dependenciesDS.length);

        const resourceElements = this.$element.find(TASK_RESOURCES_SELECTOR);
        assert.equal(resourceElements.length, resourceAssignmentsDS.length);
        assert.equal(resourceElements.first().text(), resourcesDS[0].t);
    });
});

QUnit.module("Actions", moduleConfig, () => {
    test("expand/collapse", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length);
        const expandedElement = this.$element.find(TREELIST_EXPANDED).first();
        expandedElement.trigger("dxclick");
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, 1);
        const collapsedElement = this.$element.find(TREELIST_COLLAPSED).first();
        collapsedElement.trigger("dxclick");
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length);
    });
});
