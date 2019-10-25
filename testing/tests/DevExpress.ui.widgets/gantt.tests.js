import $ from "jquery";
const { test } = QUnit;
import "common.css!";
import "ui/gantt";

QUnit.testStart(() => {
    const markup = '<div id="gantt"></div>';
    $("#qunit-fixture").html(markup);
});

const TREELIST_SELECTOR = ".dx-treelist",
    TREELIST_DATA_ROW_SELECTOR = ".dx-data-row",
    TREELIST_WRAPPER_SELECTOR = ".dx-gantt-treelist-wrapper",
    TREELIST_HEADER_ROW_SELECTOR = ".dx-header-row",
    GANTT_VIEW_SELECTOR = ".dx-gantt-view",
    GANTT_VIEW_ROW_SELECTOR = ".dx-gantt-altRow",
    TASK_WRAPPER_SELECTOR = ".dx-gantt-taskWrapper",
    TASK_RESOURCES_SELECTOR = ".dx-gantt-taskRes",
    TASK_ARROW_SELECTOR = ".dx-gantt-arrow",
    TASK_TITLE_IN_SELECTOR = ".dx-gantt-titleIn",
    TASK_TITLE_OUT_SELECTOR = ".dx-gantt-titleOut",
    TREELIST_EXPANDED_SELECTOR = ".dx-treelist-expanded",
    TREELIST_COLLAPSED_SELECTOR = ".dx-treelist-collapsed",
    SELECTION_SELECTOR = ".dx-gantt-sel",
    SPLITTER_WRAPPER_SELECTOR = ".dx-splitter-wrapper",
    SPLITTER_SELECTOR = ".dx-splitter",
    POPUP_SELECTOR = ".dx-popup-normal",
    GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR = ".dx-gantt-hb",
    OVERLAY_WRAPPER_SELECTOR = ".dx-overlay-wrapper",
    CONTEXT_MENU_SELECTOR = ".dx-context-menu",
    INPUT_TEXT_EDITOR_SELECTOR = ".dx-texteditor-input";


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
const getGanttViewCore = (gantt) => {
    return gantt._ganttView._ganttViewCore;
};
const showTaskEditDialog = (gantt) => {
    const ganttCore = getGanttViewCore(gantt);
    const task = ganttCore.viewModel.tasks.items[0];
    ganttCore.commandManager.showTaskEditDialog.execute(task);
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
    test("row heights", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const treeListRowElement = this.$element.find(TREELIST_DATA_ROW_SELECTOR).last().get(0);
        const ganttViewRowElement = this.$element.find(GANTT_VIEW_ROW_SELECTOR).get(0);
        assert.equal(treeListRowElement.getBoundingClientRect().height, ganttViewRowElement.getBoundingClientRect().height, "row heights are equal");
    });
});

QUnit.module("Options", moduleConfig, () => {
    test("taskListWidth", (assert) => {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const treeListWrapperElement = this.$element.find(TREELIST_WRAPPER_SELECTOR);
        assert.equal(treeListWrapperElement.width(), 300, "300px");
        this.instance.option("taskListWidth", 500);
        assert.equal(treeListWrapperElement.width(), 500, "500px");
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
            },
            columns: ["t"]
        };
        this.createInstance(options);
        this.clock.tick();
        const taskWrapperElements = this.$element.find(TASK_WRAPPER_SELECTOR);
        assert.equal(taskWrapperElements.length, tasksDS.length);
        const firstTitle = taskWrapperElements.first().children().children().first().text();
        assert.equal(firstTitle, tasksDS[0].t);
        const firstProgressElement = taskWrapperElements.first().children().children().last();
        assert.ok(firstProgressElement.width() > 0);
        const $firstTreeListRowText = this.$element.find(TREELIST_DATA_ROW_SELECTOR).first().find(".dx-treelist-text-content").first().text();
        assert.equal($firstTreeListRowText, tasksDS[0].t, "treeList has title text");

        const dependencyElements = this.$element.find(TASK_ARROW_SELECTOR);
        assert.equal(dependencyElements.length, dependenciesDS.length);

        const resourceElements = this.$element.find(TASK_RESOURCES_SELECTOR);
        assert.equal(resourceElements.length, resourceAssignmentsDS.length);
        assert.equal(resourceElements.first().text(), resourcesDS[0].t);
    });
    test("columns", (assert) => {
        const options = {
            tasks: { dataSource: tasks },
            columns: [
                { dataField: "title", caption: "Subject" },
                { dataField: "start", caption: "Start Date" }
            ]
        };
        this.createInstance(options);
        this.clock.tick();
        let $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 2, "treeList has 2 columns");
        assert.equal($treeListHeaderRow.children().eq(0).text(), "Subject", "first column title is checked");
        assert.equal($treeListHeaderRow.children().eq(1).text(), "Start Date", "second column title is checked");

        this.instance.option("columns[0].visible", false);
        $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, "treeList has 1 visible columns");
        assert.equal($treeListHeaderRow.children().eq(0).text(), "Start Date", "first visible column title is checked");

        this.instance.option("columns", [{ dataField: "title", caption: "Task" }]);
        $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, "treeList has 1 columns");
        assert.equal($treeListHeaderRow.children().eq(0).text(), "Task", "first column title is checked");
    });
    test("selectedRowKey", (assert) => {
        const selectedRowKey = 2;
        const options = {
            tasks: { dataSource: tasks },
            selectedRowKey: selectedRowKey
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListSelectedRowKeys = this.instance._treeList.option("selectedRowKeys");
        assert.equal(treeListSelectedRowKeys.length, 1, "only one treeList row is selected");
        assert.equal(treeListSelectedRowKeys, selectedRowKey, "second treeList row is selected");
        this.instance.option("selectedRowKey", undefined);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
        this.instance.option("selectedRowKey", 1);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 1);
        this.instance.option("selectedRowKey", undefined);
        this.clock.tick();
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
    });
    test("allowSelection", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        this.instance.option("selectedRowKey", 1);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 1);
        this.instance.option("allowSelection", false);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
    });
    test("showRowLines", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.ok(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, "ganttView has borders by default");
        assert.equal(this.instance._treeList.option("showRowLines"), true, "treeList has borders by default");
        this.instance.option("showRowLines", false);
        assert.equal(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length, 0, "ganttView has no borders");
        assert.equal(this.instance._treeList.option("showRowLines"), false, "treeList has no borders");
        this.instance.option("showRowLines", true);
        assert.ok(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, "ganttView has borders");
        assert.equal(this.instance._treeList.option("showRowLines"), true, "treeList has borders");
    });
    test("editing", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        let coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, false, "editing is prohibited by default");
        assert.equal(coreEditingSettings.allowTaskAdding, true, "task adding allowed by default");
        assert.equal(coreEditingSettings.allowTaskDeleting, true, "task deleting allowed by default");
        assert.equal(coreEditingSettings.allowTaskUpdating, true, "task updating allowed by default");
        assert.equal(coreEditingSettings.allowDependencyAdding, true, "dependency adding allowed by default");
        assert.equal(coreEditingSettings.allowDependencyDeleting, true, "dependency deleting allowed by default");
        assert.equal(coreEditingSettings.allowDependencyUpdating, true, "dependency updating allowed by default");
        assert.equal(coreEditingSettings.allowResourceAdding, true, "resource adding allowed by default");
        assert.equal(coreEditingSettings.allowResourceDeleting, true, "resource deleting allowed by default");
        assert.equal(coreEditingSettings.allowResourceUpdating, true, "resource updating allowed by default");
        this.instance.option("editing", {
            enabled: true,
            allowTaskAdding: false,
            allowTaskDeleting: false,
            allowTaskUpdating: false,
            allowDependencyAdding: false,
            allowDependencyDeleting: false,
            allowDependencyUpdating: false,
            allowResourceAdding: false,
            allowResourceDeleting: false,
            allowResourceUpdating: false,
        });
        coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, true, "editing allowed");
        assert.equal(coreEditingSettings.allowTaskAdding, false, "task adding is prohibited");
        assert.equal(coreEditingSettings.allowTaskDeleting, false, "task deleting is prohibited");
        assert.equal(coreEditingSettings.allowTaskUpdating, false, "task updating is prohibited");
        assert.equal(coreEditingSettings.allowDependencyAdding, false, "dependency adding is prohibited");
        assert.equal(coreEditingSettings.allowDependencyDeleting, false, "dependency deleting is prohibited");
        assert.equal(coreEditingSettings.allowDependencyUpdating, false, "dependency updating is prohibited");
        assert.equal(coreEditingSettings.allowResourceAdding, false, "resource adding is prohibited");
        assert.equal(coreEditingSettings.allowResourceDeleting, false, "resource deleting is prohibited");
        assert.equal(coreEditingSettings.allowResourceUpdating, false, "resource updating is prohibited");
        this.instance.option("editing.enabled", false);
        coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, false, "editing is prohibited");
    });
    test("scaleType", (assert) => {
        const getFirstHeaderTitle = () => {
            return this.$element.find(".dx-gantt-tsa").eq(1).find(".dx-gantt-si").first().text();
        };
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        assert.equal(getFirstHeaderTitle(), "January", "is months scale type (auto)");
        this.instance.option("scaleType", "minutes");
        assert.equal(getFirstHeaderTitle(), "10", "is minutes scale type");
        this.instance.option("scaleType", "hours");
        assert.equal(getFirstHeaderTitle(), "12:00 AM", "is hours scale type");
        this.instance.option("scaleType", "days");
        assert.equal(getFirstHeaderTitle(), "Sun, 17 Feb", "is days scale type");
        this.instance.option("scaleType", "weeks");
        assert.equal(getFirstHeaderTitle(), "Sun, 17 Feb - Sat, 23 Feb", "is weeks scale type");
        this.instance.option("scaleType", "months");
        assert.equal(getFirstHeaderTitle(), "January", "is months scale type");

        this.instance.option("tasks.dataSource", [{ "id": 0, "title": "t", "start": "2019-02-21", "end": "2019-02-26" }]);
        assert.equal(getFirstHeaderTitle(), "January", "is still months scale type");
        this.instance.option("scaleType", "auto");
        assert.equal(getFirstHeaderTitle(), "Sun, 17 Feb", "is days scale type (auto)");
    });
});

QUnit.module("Events", moduleConfig, () => {
    test("selection changed", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option("onSelectionChanged", (e) => {
            keyFromEvent = e.selectedRowKey;
        });
        this.instance.option("selectedRowKey", key);
        this.clock.tick();
        assert.equal(keyFromEvent, key);
    });
});

QUnit.module("Actions", moduleConfig, () => {
    test("expand", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length);
        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger("dxclick");
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, 1);
    });
    test("collapse", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length);
        const collapsedElement = this.$element.find(TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger("dxclick");
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length);
    });

    test("move splitter", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const splitterWrapper = this.$element.find(SPLITTER_WRAPPER_SELECTOR);
        const splitter = this.$element.find(SPLITTER_SELECTOR);

        const treeListWrapperElement = this.$element.find(TREELIST_WRAPPER_SELECTOR);
        const treeListWrapperLeftOffset = treeListWrapperElement.offset().left;
        const treeListWrapperTopOffset = treeListWrapperElement.offset().top;

        const ganttView = this.$element.find(GANTT_VIEW_SELECTOR);

        const splitterContainerWrapperWidth = $(treeListWrapperElement).parent().width();

        assert.ok(splitterWrapper, "Splitter wrapper has been found");
        assert.ok(splitter, "Splitter has been found");

        splitter.trigger($.Event("dxpointerdown", { pointerType: "mouse" }));
        splitter.trigger($.Event("dxpointermove", {
            pointerType: "mouse",
            pageX: treeListWrapperLeftOffset + 100,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event("dxpointerup", { pointerType: "mouse" }));

        assert.equal(treeListWrapperElement.width(), 100);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth - 100);
        assert.equal(splitterWrapper.css("left"), "100px", "Splitter has been moved by mouse");

        splitter.trigger($.Event("dxpointerdown", { pointerType: "touch" }));
        splitter.trigger($.Event("dxpointermove", {
            pointerType: "touch",
            pageX: treeListWrapperLeftOffset + 300,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event("dxpointerup", { pointerType: "touch" }));

        assert.equal(treeListWrapperElement.width(), 300);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth - 300);
        assert.equal(splitterWrapper.css("left"), "300px", "Splitter has been moved by touch");

        splitter.trigger($.Event("dxpointerdown"));
        splitter.trigger($.Event("dxpointermove", {
            pageX: treeListWrapperLeftOffset - 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event("dxpointerup"));

        assert.equal(treeListWrapperElement.width(), 0);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth);
        assert.equal(splitterWrapper.css("left"), "0px", "Splitter has not cross the left side");

        splitter.trigger($.Event("dxpointerdown"));
        splitter.trigger($.Event("dxpointermove", {
            pageX: splitterContainerWrapperWidth + 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event("dxpointerup"));

        assert.equal(treeListWrapperElement.width(), splitterContainerWrapperWidth - splitter.width());
        assert.equal(ganttView.width(), splitter.width());
        assert.equal(splitterWrapper.css("left"), `${splitterContainerWrapperWidth - splitter.width()}px`, "Splitter has not cross the right side");
    });
});

QUnit.module("Dialogs", moduleConfig, () => {
    test("common", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        assert.equal($("body").find(POPUP_SELECTOR).length, 1, "dialog is shown");
        this.instance.repaint();
        assert.equal($("body").find(POPUP_SELECTOR).length, 0, "dialog is missed after widget repainting");
        this.clock.tick();

        showTaskEditDialog(this.instance);
        assert.equal($("body").find(POPUP_SELECTOR).length, 1, "dialog is shown");
        this.instance.dispose();
        assert.equal($("body").find(POPUP_SELECTOR).length, 0, "dialog is missed after widget disposing");
    });
    test("task editing", (assert) => {
        this.createInstance(allSourcesOptions);
        this.instance.option("editing.enabled", true);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        let $dialog = $("body").find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, "dialog is shown");

        const $inputs = $dialog.find(INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), tasks[0].title, "title text is shown");
        assert.equal((new Date($inputs.eq(1).val())).getTime(), tasks[0].start.getTime(), "start task text is shown");
        assert.equal((new Date($inputs.eq(2).val())).getTime(), tasks[0].end.getTime(), "end task text is shown");
        assert.equal($inputs.eq(3).val(), tasks[0].progress + "%", "progress text is shown");

        const testTitle = "text";
        const titleTextBox = $dialog.find(".dx-textbox").eq(0).dxTextBox("instance");
        titleTextBox.option("value", testTitle);
        const $okButton = $dialog.find(".dx-popup-bottom").find(".dx-button").eq(0);
        $okButton.trigger("dxclick");
        this.clock.tick();
        const $taskWrapper = this.$element.find(TASK_WRAPPER_SELECTOR).eq(0);
        const firstTitle = $taskWrapper.children().children().first().text();
        assert.equal(firstTitle, testTitle, "title text was modified");

        this.instance.option("editing.enabled", false);
        showTaskEditDialog(this.instance);
        assert.equal($dialog.find(".dx-popup-bottom").find(".dx-button").length, 1, "only cancel button in toolbar");
        $dialog = $("body").find(POPUP_SELECTOR);
        const inputs = $dialog.find(".dx-texteditor-input");
        assert.equal(inputs.attr("readOnly"), "readonly", "all inputs is readOnly");
    });
    test("resources editing", (assert) => {
        this.createInstance(allSourcesOptions);
        this.instance.option("editing.enabled", true);
        this.clock.tick();
        getGanttViewCore(this.instance).commandManager.showResourcesDialog.execute();
        this.clock.tick();
        const $dialog = $("body").find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, "dialog is shown");

        let $resources = $dialog.find(".dx-list-item");
        assert.equal($resources.length, resources.length, "dialog has all resources");

        const $deleteButtons = $dialog.find(".dx-list-static-delete-button");
        $deleteButtons.eq(0).trigger("dxclick");
        $resources = $dialog.find(".dx-list-item");
        assert.equal($resources.length, resources.length - 1, "first resource removed from list");

        const secondResourceText = resources[1].text;
        const thirdResourceText = resources[2].text;
        const newResourceText = "newResource";
        const textBox = $dialog.find(".dx-textbox").eq(0).dxTextBox("instance");
        textBox.option("text", newResourceText);
        const $addButton = $dialog.find(".dx-button-has-text").eq(0);
        $addButton.dxButton("instance").option("disabled", false);
        $addButton.trigger("dxclick");
        $resources = $dialog.find(".dx-list-item");
        assert.equal($resources.length, resources.length, "added resource to list");

        const $okButton = $dialog.find(".dx-popup-bottom").find(".dx-button").eq(0);
        $okButton.trigger("dxclick");
        this.clock.tick();
        assert.equal(resources[0].text, secondResourceText, "first resource removed from ds");
        assert.equal(resources[1].text, thirdResourceText, "second resource ds");
        assert.equal(resources[2].text, newResourceText, "new resource ds");
    });
});

QUnit.module("DataSources", moduleConfig, () => {
    test("inserting", (assert) => {
        this.createInstance(allSourcesOptions);
        this.instance.option("editing.enabled", true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date("2019-02-21");
        const newEnd = new Date("2019-02-22");
        const newTitle = "New";
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, "1");
        this.clock.tick();
        assert.equal(tasks.length, tasksCount + 1, "new task was created in ds");
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, newTitle, "new task title is right");
        assert.equal(createdTask.start, newStart, "new task start is right");
        assert.equal(createdTask.end, newEnd, "new task end is right");
    });
    test("updating", (assert) => {
        this.createInstance(allSourcesOptions);
        this.instance.option("editing.enabled", true);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date("2019-02-21");
        const updatedEnd = new Date("2019-02-22");
        const updatedTitle = "New";
        getGanttViewCore(this.instance).commandManager.changeTaskTitleCommand.execute(updatedTaskId.toString(), updatedTitle);
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        getGanttViewCore(this.instance).commandManager.changeTaskEndCommand.execute(updatedTaskId.toString(), updatedEnd);
        this.clock.tick();
        const updatedTask = tasks.filter((t) => t.id === updatedTaskId)[0];
        assert.equal(updatedTask.title, updatedTitle, "task title is updated");
        assert.equal(updatedTask.start, updatedStart, "new task start is updated");
        assert.equal(updatedTask.end, updatedEnd, "new task end is updated");
    });
    test("removing", (assert) => {
        this.createInstance(allSourcesOptions);
        this.instance.option("editing.enabled", true);
        this.clock.tick();

        const removedTaskId = 3;
        const tasksCount = tasks.length;
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(removedTaskId.toString());
        this.clock.tick();
        assert.equal(tasks.length, tasksCount - 1, "tasks less");
        const removedTask = tasks.filter((t) => t.id === removedTaskId)[0];
        assert.equal(removedTask, undefined, "task was removed");
    });
});

QUnit.module("Context Menu", moduleConfig, () => {
    test("showing", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $("body").find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, "menu is hidden on create");
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 1, "menu is visible after right click");
    });
    test("tree list context menu", (assert) => {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $("body").find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, "menu is hidden on create");
        var $cellElement = $(this.instance._treeList.getCellElement(0, 0));
        $cellElement.trigger("contextmenu");
        assert.equal(getContextMenuElement().length, 2, "menu is visible after right click in tree list");
    });
});
