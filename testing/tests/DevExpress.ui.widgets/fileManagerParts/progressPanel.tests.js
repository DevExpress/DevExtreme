import $ from "jquery";
import fx from "animation/fx";
import { FileManagerProgressPanelWrapper } from "../../../helpers/fileManagerHelpers.js";
import FileManagerProgressPanelMock from "../../../helpers/fileManager/notification.progress_panel.mock.js";
import FileManagerLogger from "../../../helpers/fileManager/logger.js";

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.$element = $("#fileManager");

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },

    afterEach: function() {
        this.clock.tick();

        this.clock.restore();
        fx.off = false;
    }

};

const createProgressPanel = context => {
    const logger = new FileManagerLogger();
    context.logger = logger;

    const $progressPanel = $("<div>").appendTo(context.$element);
    context.progressPanel = new FileManagerProgressPanelMock($progressPanel, {
        onOperationClosed: ({ info }) => logger.addEntry("onOperationClosed", { id: info.testOperationId }),
        onOperationCanceled: ({ info }) => logger.addEntry("onOperationCanceled", { id: info.testOperationId }),
        onOperationItemCanceled: ({ item, itemIndex }) => logger.addEntry("onOperationItemCanceled", {
            item: {
                commonText: item.commonText,
                imageUrl: item.imageUrl
            },
            itemIndex
        }),
        onPanelClosed: () => logger.addEntry("onPanelClosed", { })
    });

    context.clock.tick(400);

    context.progressPanelWrapper = new FileManagerProgressPanelWrapper($progressPanel);
};

const createDetailItems = () => {
    return [
        { commonText: "File 1.txt", imageUrl: "doc" },
        { commonText: "Photo 2.jpg", imageUrl: "image" }
    ];
};

QUnit.module("Progress panel tests", moduleConfig, () => {

    test("add operation", function(assert) {
        createProgressPanel(this);

        this.progressPanel.addOperation("Common operation text");

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "rendered one operation");

        let common = infos[0].common;
        assert.equal(common.commonText, "Common operation text", "common text rendered");
        assert.equal(common.progressBarValue, 0, "progress bar initial value rendered");
        assert.notOk(common.closeButtonVisible, "close button rendered as hidden");

        this.progressPanel.addOperation("New operation", true);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 2, "rendered one more operation");

        common = infos[0].common;
        assert.equal(common.commonText, "New operation", "common text rendered");
        assert.equal(common.progressBarValue, 0, "progress bar initial value rendered");
        assert.ok(common.closeButtonVisible, "close button rendered as hidden");
    });

    test("add operation details", function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation("Common operation text");
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "rendered one operation");

        let details = infos[0].details;
        assert.equal(details.length, 2, "all detail items rendered");

        assert.equal(details[0].commonText, "File 1.txt", "detail item common text rendered");
        assert.equal(details[0].progressBarValue, 0, "detail item progress bar initial value rendered");
        assert.notOk(details[0].closeButton, "detail item has no close button");
        assert.ok(details[0].$image.hasClass("dx-icon-doc"), "detail item has correct icon");

        assert.equal(details[1].commonText, "Photo 2.jpg", "detail item common text rendered");
        assert.equal(details[1].progressBarValue, 0, "detail item progress bar initial value rendered");
        assert.notOk(details[1].closeButton, "detail item has no close button");
        assert.ok(details[1].$image.hasClass("dx-icon-image"), "detail item has correct icon");

        operationInfo = this.progressPanel.addOperation("New action", true);
        const newDetailItems = createDetailItems();
        newDetailItems[0].commonText = "Report 3.rtf";
        this.progressPanel.addOperationDetails(operationInfo, newDetailItems, true);

        details = this.progressPanelWrapper.getInfos()[0].details;
        assert.equal(details[0].commonText, "Report 3.rtf", "detail item common text rendered");
        assert.ok(details[0].closeButtonVisible, "detail item close button visible");
        assert.ok(details[1].closeButtonVisible, "detail item close button visible");
    });

    test("update operation item progress", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Common operation text", true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);
        this.progressPanel.updateOperationItemProgress(operationInfo, 1, 50, 25);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 25, "common progress bar value updated");
        assert.equal(info.details[1].progressBarValue, 50, "detail item progress bar has max value");
    });

    test("complete operation item with progress auto update", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Common operation text");
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());
        this.progressPanel.completeOperationItem(operationInfo, 1, 50);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 50, "common progress bar value updated");
        assert.equal(info.details[1].progressBarValue, 100, "detail item progress bar has max value");
        assert.equal(info.details[1].progressBarStatusText, "Done", "detail item progress bar status text updated");
    });

    test("complete operation item without progress auto update", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Common operation text", true, false);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);
        this.progressPanel.completeOperationItem(operationInfo, 1, 50);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 0, "common progress bar value has not changed");
        assert.equal(info.details[1].progressBarValue, 0, "detail item progress bar has not changed");
        assert.notOk(info.details[1].closeButtonVisible, "detail item close button hidden");
    });

    test("complete operation", function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation("Common operation text");
        this.progressPanel.completeOperation(operationInfo, "Operation completed");

        let common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, "Operation completed", "common text updated");
        assert.equal(common.progressBarValue, 100, "common progress bar value has max value");
        assert.ok(common.closeButtonVisible, "common close button shown");

        operationInfo = this.progressPanel.addOperation("New action", false, false);
        this.progressPanel.completeOperation(operationInfo, "New action finished", false, "Additional info");

        common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, "New action finished", "common text updated");
        assert.equal(common.progressBarValue, 0, "common progress bar value has not changed");
        assert.equal(common.progressBarStatusText, "Additional info", "common progress bar status text updated");
        assert.ok(common.closeButtonVisible, "common close button shown");

        operationInfo = this.progressPanel.addOperation("Test operation");
        this.progressPanel.completeOperation(operationInfo, "Test done", true);

        common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, "Test done", "common text updated");
        assert.notOk(common.progressBar, "progress bar removed");
    });

    test("render error", function(assert) {
        createProgressPanel(this);

        const $container = $("<div>").appendTo(this.$element);
        this.progressPanel.renderError($container, null, "Some error occurred");

        const $error = this.progressPanelWrapper.findError($container);
        assert.equal($error.length, 1, "error rendered");
        assert.equal($error.text(), "Some error occurred", "error text rendered");
    });

    test("create error details progress box", function(assert) {
        createProgressPanel(this);

        const $container = $("<div>").appendTo(this.$element);
        const itemInfo = { commonText: "File 1.txt", imageUrl: "doc" };
        this.progressPanel.createErrorDetailsProgressBox($container, itemInfo, "Some error occurred");

        const boxes = this.progressPanelWrapper.findProgressBoxes($container);
        assert.equal(boxes.length, 1, "progress box rendered");

        const box = boxes[0];
        assert.ok(box.hasError, "error rendered");
        assert.equal(box.errorText, "Some error occurred", "error text rendered");
        assert.equal(box.commonText, "File 1.txt", "common text rendered");
        assert.notOk(box.$progressBar.length, "progress bar not rendered");
        assert.notOk(box.$closeButton.length, "close button not rendered");
        assert.ok(box.$image.hasClass("dx-icon-doc"), "correct icon rendered");
    });

    test("complete single operation with error", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Common operation text");
        this.progressPanel.completeSingleOperationWithError(operationInfo, "Some error occcurred");

        const info = this.progressPanelWrapper.getInfos()[0];
        const common = info.common;
        assert.ok(common.hasError, "error rendered");
        assert.equal(common.errorText, "Some error occcurred", "error text rendered");
        assert.equal(common.commonText, "Common operation text", "common text rendered");
        assert.notOk(common.$progressBar.length, "progress bar not rendered");
        assert.ok(common.closeButtonVisible, "close button visible");
    });

    test("add operation details error", function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation("Common operation text");
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());
        this.progressPanel.addOperationDetailsError(operationInfo, 1, "Some error occurred");

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "operation rendered");
        assert.equal(infos[0].details.length, 2, "all detail items rendered");

        let item = infos[0].details[1];
        assert.ok(item.hasError, "error rendered");
        assert.equal(item.errorText, "Some error occurred", "error text rendered");
        assert.equal(item.commonText, "Photo 2.jpg", "detail item common text rendered");
        assert.notOk(item.$progressBar.length, "detail item progress bar has not rendered");
        assert.notOk(item.closeButton, "detail item has no close button");
        assert.ok(item.$image.hasClass("dx-icon-image"), "detail item has correct icon");

        operationInfo = this.progressPanel.addOperation("New action", true);
        const newDetailItems = createDetailItems();
        newDetailItems[0].commonText = "Report 3.rtf";
        this.progressPanel.addOperationDetails(operationInfo, newDetailItems, true);
        this.progressPanel.addOperationDetailsError(operationInfo, 0, "System failure");

        infos = this.progressPanelWrapper.getInfos();
        item = infos[0].details[0];
        assert.ok(item.hasError, "error rendered");
        assert.equal(item.errorText, "System failure", "error text rendered");
        assert.equal(item.commonText, "Report 3.rtf", "detail item common text rendered");
        assert.notOk(item.closeButtonVisible, "detail item close button is not visible");
    });

    test("panel closed event", function(assert) {
        createProgressPanel(this);

        this.progressPanelWrapper.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        const expectedEntries = [ { type: "onPanelClosed" } ];
        assert.deepEqual(expectedEntries, this.logger.getEntries(), "panel closed event raised");
    });

    test("close operaiton", function(assert) {
        createProgressPanel(this);

        const operationInfo1 = this.progressPanel.addOperation("Operation 1");
        this.progressPanel.completeOperation(operationInfo1, "Completed 1");
        const operationInfo2 = this.progressPanel.addOperation("Operation 2");
        this.progressPanel.completeOperation(operationInfo2, "Completed 2");

        let infos = this.progressPanelWrapper.getInfos();
        infos[0].common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "operation count decreased");
        assert.equal(infos[0].common.commonText, "Completed 1", "first operation remained");
        assert.deepEqual(this.logger.getEntries(), [ { id: 2, type: "onOperationClosed" } ], "event raised");

        this.logger.clear();
        infos[0].common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 0, "no operations remained");
        assert.deepEqual(this.logger.getEntries(), [ { id: 1, type: "onOperationClosed" } ], "event raised");
    });

    test("cancel operaiton", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Operation 1", true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);

        let info = this.progressPanelWrapper.getInfos()[0];
        info.common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "operation remained");
        info = infos[0];
        assert.equal(info.common.commonText, "Operation 1", "common text has not changed");
        assert.notOk(info.common.closeButtonVisible, "common close button is hidden");
        assert.equal(info.details.length, 2, "detail item count has not changed");
        assert.notOk(info.details[0].closeButtonVisible, "detail item close button is hidden");
        assert.notOk(info.details[1].closeButtonVisible, "detail item close button is hidden");
        assert.deepEqual(this.logger.getEntries(), [ { id: 1, type: "onOperationCanceled" } ], "event raised");
    });

    test("cancel operaiton item", function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation("Operation 1", true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);

        let info = this.progressPanelWrapper.getInfos()[0];
        info.details[0].$closeButton.trigger("dxclick");
        this.clock.tick(400);

        const expectedEntries = [
            {
                item: { commonText: "File 1.txt", imageUrl: "doc" },
                itemIndex: 0,
                type: "onOperationItemCanceled"
            }
        ];
        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "operation remained");
        info = infos[0];
        assert.equal(info.common.commonText, "Operation 1", "common text has not changed");
        assert.ok(info.common.closeButtonVisible, "common close button is visible");
        assert.equal(info.details.length, 2, "detail item count has not changed");
        assert.notOk(info.details[0].closeButtonVisible, "detail item close button is hidden");
        assert.ok(info.details[1].closeButtonVisible, "detail item close button is visible");
        assert.equal(info.details[0].progressBarStatusText, "Canceled", "detail item status text updated");
        assert.deepEqual(this.logger.getEntries(), expectedEntries, "event raised");
    });

    test("Amount of separators must be one less of infos amount", function(assert) {
        createProgressPanel(this);

        const operationInfo1 = this.progressPanel.addOperation("Operation 1");
        this.progressPanel.completeOperation(operationInfo1, "Completed 1");
        const operationInfo2 = this.progressPanel.addOperation("Operation 2");
        this.progressPanel.completeOperation(operationInfo2, "Completed 2");
        const operationInfo3 = this.progressPanel.addOperation("Operation 3");
        this.progressPanel.completeOperation(operationInfo3, "Completed 3");

        let infos = this.progressPanelWrapper.getInfos();
        let separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 2, "Correct number of separators");

        infos[0].common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 1, "Correct number of separators");

        const operationInfo4 = this.progressPanel.addOperation("Operation 4");
        this.progressPanel.completeOperation(operationInfo4, "Completed 4");

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 2, "Correct number of separators");

        infos[0].common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 1, "Correct number of separators");

        infos[0].common.$closeButton.trigger("dxclick");
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 0, "Correct number of separators");

    });

});
