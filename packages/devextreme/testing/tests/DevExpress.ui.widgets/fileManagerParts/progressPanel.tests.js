import $ from 'jquery';
import fx from 'common/core/animation/fx';
import FileUploader from 'ui/file_uploader';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { createTestFileSystem, createUploaderFiles, FileManagerProgressPanelWrapper, FileManagerWrapper } from '../../../helpers/fileManagerHelpers.js';
import FileManagerProgressPanelMock from '../../../helpers/fileManager/notification.progress_panel.mock.js';
import FileManagerLogger from '../../../helpers/fileManager/logger.js';
import { CLICK_EVENT } from '../../../helpers/grid/keyboardNavigationHelper.js';
import SlowFileProvider from '../../../helpers/fileManager/file_provider.slow.js';
import CustomFileSystemProvider from 'file_management/custom_provider';
import { implementationsMap } from 'core/utils/size';

const { test } = QUnit;
const FileUploaderInternals = FileUploader.__internals;

const moduleConfig = {

    beforeEach: function() {
        this.$element = $('#fileManager');

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },

    afterEach: function() {
        this.clock.tick(10);

        this.clock.restore();
        fx.off = false;
    }

};

const integrationModuleConfig = {
    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        FileUploaderInternals.changeFileInputRenderer(() => $('<div>'));

        this.$element = $('#fileManager').dxFileManager({
            fileSystemProvider: fileSystem,
            selectionMode: 'single',
            itemView: {
                showFolders: true,
                showParentFolder: true
            },
            permissions: {
                create: true,
                copy: true,
                move: true,
                delete: true,
                rename: true,
                upload: true,
                download: true
            }
        });

        this.fileManager = this.$element.dxFileManager('instance');
        this.wrapper = new FileManagerWrapper(this.$element);
        this.progressPanelWrapper = new FileManagerProgressPanelWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;

        FileUploaderInternals.resetFileInputTag();
    }
};

const createProgressPanel = context => {
    const logger = new FileManagerLogger();
    context.logger = logger;

    const $progressPanel = $('<div>').appendTo(context.$element);
    context.progressPanel = new FileManagerProgressPanelMock($progressPanel, {
        onOperationClosed: ({ info }) => logger.addEntry('onOperationClosed', { id: info.testOperationId }),
        onOperationCanceled: ({ info }) => logger.addEntry('onOperationCanceled', { id: info.testOperationId }),
        onOperationItemCanceled: ({ item, itemIndex }) => logger.addEntry('onOperationItemCanceled', {
            item: {
                commonText: item.commonText,
                imageUrl: item.imageUrl
            },
            itemIndex
        }),
        onPanelClosed: () => logger.addEntry('onPanelClosed', { })
    });

    context.clock.tick(400);

    context.progressPanelWrapper = new FileManagerProgressPanelWrapper($progressPanel);
};

const createDetailItems = () => {
    return [
        { commonText: 'File 1.txt', imageUrl: 'doc' },
        { commonText: 'Photo 2.jpg', imageUrl: 'image' }
    ];
};

const createDetailItem = () => {
    return [
        { commonText: 'File 1.txt', imageUrl: 'doc' }
    ];
};

QUnit.module('Progress panel tests', moduleConfig, () => {

    test('add operation', function(assert) {
        createProgressPanel(this);

        this.progressPanel.addOperation('Common operation text');

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');

        let common = infos[0].common;
        assert.equal(common.commonText, 'Common operation text', 'common text rendered');
        assert.equal(common.progressBarValue, 0, 'progress bar initial value rendered');
        assert.notOk(common.closeButtonVisible, 'close button rendered as hidden');

        this.progressPanel.addOperation('New operation', true);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 2, 'rendered one more operation');

        common = infos[0].common;
        assert.equal(common.commonText, 'New operation', 'common text rendered');
        assert.equal(common.progressBarValue, 0, 'progress bar initial value rendered');
        assert.ok(common.closeButtonVisible, 'close button rendered as hidden');
    });

    test('add operation details', function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');

        let details = infos[0].details;
        assert.equal(details.length, 2, 'all detail items rendered');

        assert.equal(details[0].commonText, 'File 1.txt', 'detail item common text rendered');
        assert.equal(details[0].progressBarValue, 0, 'detail item progress bar initial value rendered');
        assert.notOk(details[0].closeButton, 'detail item has no close button');
        assert.ok(details[0].$image.hasClass('dx-icon-doc'), 'detail item has correct icon');

        assert.equal(details[1].commonText, 'Photo 2.jpg', 'detail item common text rendered');
        assert.equal(details[1].progressBarValue, 0, 'detail item progress bar initial value rendered');
        assert.notOk(details[1].closeButton, 'detail item has no close button');
        assert.ok(details[1].$image.hasClass('dx-icon-image'), 'detail item has correct icon');

        operationInfo = this.progressPanel.addOperation('New action', true);
        const newDetailItems = createDetailItems();
        newDetailItems[0].commonText = 'Report 3.rtf';
        this.progressPanel.addOperationDetails(operationInfo, newDetailItems, true);

        details = this.progressPanelWrapper.getInfos()[0].details;
        assert.equal(details[0].commonText, 'Report 3.rtf', 'detail item common text rendered');
        assert.ok(details[0].closeButtonVisible, 'detail item close button visible');
        assert.ok(details[1].closeButtonVisible, 'detail item close button visible');
    });

    test('update operation item progress', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Common operation text', true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);
        this.progressPanel.updateOperationItemProgress(operationInfo, 1, 50, 25);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 25, 'common progress bar value updated');
        assert.equal(info.details[1].progressBarValue, 50, 'detail item progress bar has max value');
    });

    test('complete operation item with progress auto update', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());
        this.progressPanel.completeOperationItem(operationInfo, 1, 50);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 50, 'common progress bar value updated');
        assert.equal(info.details[1].progressBarValue, 100, 'detail item progress bar has max value');
        assert.equal(info.details[1].progressBarStatusText, 'Done', 'detail item progress bar status text updated');
    });

    test('complete operation item without progress auto update', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Common operation text', true, false);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);
        this.progressPanel.completeOperationItem(operationInfo, 1, 50);

        const info = this.progressPanelWrapper.getInfos()[0];
        assert.equal(info.common.progressBarValue, 0, 'common progress bar value has not changed');
        assert.equal(info.details[1].progressBarValue, 0, 'detail item progress bar has not changed');
        assert.notOk(info.details[1].closeButtonVisible, 'detail item close button hidden');
    });

    test('complete operation', function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.completeOperation(operationInfo, 'Operation completed');

        let common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, 'Operation completed', 'common text updated');
        assert.equal(common.progressBarValue, 100, 'common progress bar value has max value');
        assert.ok(common.closeButtonVisible, 'common close button shown');

        operationInfo = this.progressPanel.addOperation('New action', false, false);
        this.progressPanel.completeOperation(operationInfo, 'New action finished', false, 'Additional info');

        common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, 'New action finished', 'common text updated');
        assert.equal(common.progressBarValue, 0, 'common progress bar value has not changed');
        assert.equal(common.progressBarStatusText, 'Additional info', 'common progress bar status text updated');
        assert.ok(common.closeButtonVisible, 'common close button shown');

        operationInfo = this.progressPanel.addOperation('Test operation');
        this.progressPanel.completeOperation(operationInfo, 'Test done', true);

        common = this.progressPanelWrapper.getInfos()[0].common;
        assert.equal(common.commonText, 'Test done', 'common text updated');
        assert.notOk(common.progressBar, 'progress bar removed');
    });

    test('render error', function(assert) {
        createProgressPanel(this);

        const $container = $('<div>').appendTo(this.$element);
        this.progressPanel._renderError($container, null, 'Some error occurred');

        const $error = this.progressPanelWrapper.findError($container);
        assert.equal($error.length, 1, 'error rendered');
        assert.equal($error.text(), 'Some error occurred', 'error text rendered');
    });

    test('complete single operation with error', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.completeSingleOperationWithError(operationInfo, 'Some error occcurred');

        const info = this.progressPanelWrapper.getInfos()[0];
        const common = info.common;
        assert.ok(common.hasError, 'error rendered');
        assert.equal(common.errorText, 'Some error occcurred', 'error text rendered');
        assert.equal(common.commonText, 'Common operation text', 'common text rendered');
        assert.notOk(common.$progressBar.length, 'progress bar not rendered');
        assert.ok(common.closeButtonVisible, 'close button visible');
    });

    test('add operation details error', function(assert) {
        createProgressPanel(this);

        let operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems());
        this.progressPanel.addOperationDetailsError(operationInfo, 1, 'Some error occurred');

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'operation rendered');
        assert.equal(infos[0].details.length, 2, 'all detail items rendered');

        let item = infos[0].details[1];
        assert.ok(item.hasError, 'error rendered');
        assert.equal(item.errorText, 'Some error occurred', 'error text rendered');
        assert.equal(item.commonText, 'Photo 2.jpg', 'detail item common text rendered');
        assert.notOk(item.$progressBar.length, 'detail item progress bar has not rendered');
        assert.notOk(item.closeButton, 'detail item has no close button');
        assert.ok(item.$image.hasClass('dx-icon-image'), 'detail item has correct icon');

        operationInfo = this.progressPanel.addOperation('New action', true);
        const newDetailItems = createDetailItems();
        newDetailItems[0].commonText = 'Report 3.rtf';
        this.progressPanel.addOperationDetails(operationInfo, newDetailItems, true);
        this.progressPanel.addOperationDetailsError(operationInfo, 0, 'System failure');

        infos = this.progressPanelWrapper.getInfos();
        item = infos[0].details[0];
        assert.ok(item.hasError, 'error rendered');
        assert.equal(item.errorText, 'System failure', 'error text rendered');
        assert.equal(item.commonText, 'Report 3.rtf', 'detail item common text rendered');
        assert.notOk(item.closeButtonVisible, 'detail item close button is not visible');
    });

    test('panel closed event', function(assert) {
        createProgressPanel(this);

        this.progressPanelWrapper.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        const expectedEntries = [ { type: 'onPanelClosed' } ];
        assert.deepEqual(expectedEntries, this.logger.getEntries(), 'panel closed event raised');
    });

    test('close operaiton', function(assert) {
        createProgressPanel(this);

        const operationInfo1 = this.progressPanel.addOperation('Operation 1');
        this.progressPanel.completeOperation(operationInfo1, 'Completed 1');
        const operationInfo2 = this.progressPanel.addOperation('Operation 2');
        this.progressPanel.completeOperation(operationInfo2, 'Completed 2');

        let infos = this.progressPanelWrapper.getInfos();
        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'operation count decreased');
        assert.equal(infos[0].common.commonText, 'Completed 1', 'first operation remained');
        assert.deepEqual(this.logger.getEntries(), [ { id: 2, type: 'onOperationClosed' } ], 'event raised');

        this.logger.clear();
        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 0, 'no operations remained');
        assert.deepEqual(this.logger.getEntries(), [ { id: 1, type: 'onOperationClosed' } ], 'event raised');
    });

    test('cancel operaiton', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Operation 1', true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);

        let info = this.progressPanelWrapper.getInfos()[0];
        info.common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'operation remained');
        info = infos[0];
        assert.equal(info.common.commonText, 'Operation 1', 'common text has not changed');
        assert.notOk(info.common.closeButtonVisible, 'common close button is hidden');
        assert.equal(info.details.length, 2, 'detail item count has not changed');
        assert.notOk(info.details[0].closeButtonVisible, 'detail item close button is hidden');
        assert.notOk(info.details[1].closeButtonVisible, 'detail item close button is hidden');
        assert.deepEqual(this.logger.getEntries(), [ { id: 1, type: 'onOperationCanceled' } ], 'event raised');
    });

    test('cancel operaiton item', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Operation 1', true);
        this.progressPanel.addOperationDetails(operationInfo, createDetailItems(), true);

        let info = this.progressPanelWrapper.getInfos()[0];
        info.details[0].$closeButton.trigger('dxclick');
        this.clock.tick(400);

        const expectedEntries = [
            {
                item: { commonText: 'File 1.txt', imageUrl: 'doc' },
                itemIndex: 0,
                type: 'onOperationItemCanceled'
            }
        ];
        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'operation remained');
        info = infos[0];
        assert.equal(info.common.commonText, 'Operation 1', 'common text has not changed');
        assert.ok(info.common.closeButtonVisible, 'common close button is visible');
        assert.equal(info.details.length, 2, 'detail item count has not changed');
        assert.notOk(info.details[0].closeButtonVisible, 'detail item close button is hidden');
        assert.ok(info.details[1].closeButtonVisible, 'detail item close button is visible');
        assert.equal(info.details[0].progressBarStatusText, 'Canceled', 'detail item status text updated');
        assert.deepEqual(this.logger.getEntries(), expectedEntries, 'event raised');
    });

    test('Amount of separators must be one less of infos amount', function(assert) {
        createProgressPanel(this);

        const operationInfo1 = this.progressPanel.addOperation('Operation 1');
        this.progressPanel.completeOperation(operationInfo1, 'Completed 1');
        const operationInfo2 = this.progressPanel.addOperation('Operation 2');
        this.progressPanel.completeOperation(operationInfo2, 'Completed 2');
        const operationInfo3 = this.progressPanel.addOperation('Operation 3');
        this.progressPanel.completeOperation(operationInfo3, 'Completed 3');

        let infos = this.progressPanelWrapper.getInfos();
        let separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 2, 'Correct number of separators');

        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 1, 'Correct number of separators');

        const operationInfo4 = this.progressPanel.addOperation('Operation 4');
        this.progressPanel.completeOperation(operationInfo4, 'Completed 4');

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 2, 'Correct number of separators');

        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 1, 'Correct number of separators');

        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 0, 'Correct number of separators');

        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 0, 'Correct number of separators');

        const operationInfo5 = this.progressPanel.addOperation('Operation 5');
        this.progressPanel.completeOperation(operationInfo5, 'Completed 5');

        separators = this.progressPanelWrapper.getSeparators();
        assert.equal(separators.length, 0, 'Correct number of separators');
    });

    test('Empty list text must be displayed when there are no operations on the panel', function(assert) {
        createProgressPanel(this);

        assert.strictEqual(this.progressPanelWrapper.getInfosContainer().text(), 'No operations', 'Empty list text rendered after first load');

        const operationInfo1 = this.progressPanel.addOperation('Operation 1');
        this.progressPanel.completeOperation(operationInfo1, 'Completed 1');

        assert.notStrictEqual(this.progressPanelWrapper.getInfosContainer().text(), 'No operations', 'There are no empty list text');

        const infos = this.progressPanelWrapper.getInfos();
        infos[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.progressPanelWrapper.getInfosContainer().text(), 'No operations', 'Empty list text rendered when there are no operatoins left');
    });

    test('single failed operation with details must not contain a close button for details', function(assert) {
        createProgressPanel(this);

        const operationInfo = this.progressPanel.addOperation('Common operation text');
        this.progressPanel.addOperationDetails(operationInfo, createDetailItem());

        this.progressPanel.completeSingleOperationWithError(operationInfo, 'Some error occcurred');

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');

        const common = infos[0].common;
        assert.ok(common.closeButtonVisible, 'close button visible');

        const details = infos[0].details;
        assert.equal(details.length, 1, 'one detail item rendered');

        const detail = details[0];
        assert.ok(detail.hasError, 'error rendered');
        assert.equal(detail.errorText, 'Some error occcurred', 'error text rendered');
        assert.equal(detail.commonText, 'File 1.txt', 'detail item common text rendered');
        assert.notOk(detail.$progressBar.length, 'progress bar not rendered');
        assert.notOk(detail.closeButton, 'detail item has no close button');
        assert.ok(detail.$image.hasClass('dx-icon-doc'), 'detail item has correct icon');
    });

});

QUnit.module('Progress panel integration tests', integrationModuleConfig, () => {

    test('the progress panel cannot be shown if showPanel option is false', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;
        resizeCallbacks.fire();
        this.fileManager.option({
            notifications: {
                showPanel: false
            },
            width: '1200px'
        });
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarRefreshButton(true).trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', 'progress panel is hidden');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '0px', 'progress panel is hidden');
        implementationsMap.getWidth = originalFunc;
    });

    test('the progress panel hides if to set showPanel option false when pane is shown', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;
        resizeCallbacks.fire();
        this.fileManager.option({
            notifications: {
                showPanel: true
            },
            width: '1200px'
        });
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;
        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarRefreshButton(true).trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', 'progress panel is shown');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '340px', 'progress panel is shown');

        this.fileManager.option('notifications.showPanel', false);
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', 'progress panel is hidden');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '0px', 'progress panel is hidden');
        implementationsMap.getWidth = originalFunc;
    });

    test('it\'s impossible to add operations to the progress panel if showPanel option is false', function(assert) {
        this.fileManager.option('notifications.showPanel', false);
        this.clock.tick(400);

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations');

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is still no operations');
    });

    test('already added operations removes from the progress panel after set showPanel option to false', function(assert) {
        this.fileManager.option('notifications.showPanel', true);
        this.clock.tick(400);

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations');

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'there is one operation');
        assert.equal(infos[0].common.commonText, 'Deleted an item from Files', 'common text is correct');

        this.fileManager.option('notifications.showPanel', false);
        this.clock.tick(400);

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations again');
    });

    test('refresh buttons status icon is default if showPanel option is false', function(assert) {
        this.fileManager.option('notifications.showPanel', false);
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        const $refresh = this.wrapper.getToolbarButton('Refresh');
        assert.strictEqual($refresh.length, 2, 'refresh buttons exists');
        assert.ok(this.wrapper.getToolbarRefreshButtonState().isDefault, 'refresh button is in default state');
        assert.ok(this.wrapper.getToolbarRefreshButtonState(true).isDefault, 'refresh button is in default state');
    });

    test('long-running operation cannot be shown in case of showPanel is dynamically set to true-false-true', function(assert) {
        const operationDelay = 1500;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'd'
            }),
            notifications: {
                showPanel: true
            }
        });
        this.clock.tick(400);

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations');

        const initialCount = this.wrapper.getRowsInDetailsView().length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick((operationDelay - 300) / 3);

        assert.equal(this.wrapper.getRowsInDetailsView().length, initialCount, 'files count is the same yet');
        assert.notOk(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is hidden');

        this.fileManager.option('notifications.showPanel', false);
        this.clock.tick((operationDelay - 300) / 3);

        assert.equal(this.wrapper.getRowsInDetailsView().length, initialCount, 'files count is the same yet');
        assert.notOk(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is hidden');

        this.fileManager.option('notifications.showPanel', true);
        this.clock.tick((operationDelay - 300) / 3);

        assert.equal(this.wrapper.getRowsInDetailsView().length, initialCount, 'files count is the same yet');
        assert.notOk(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is hidden');

        this.clock.tick(400);

        assert.equal(this.wrapper.getRowsInDetailsView().length, initialCount - 1, 'files count decreased');
        assert.ok(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is visible');
        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is still no operations');
    });

    test('the progress panel does not hides when window changes its width', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;
        resizeCallbacks.fire();
        this.fileManager.option({
            notifications: {
                showPanel: true
            },
            width: '1200px'
        });
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;
        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarRefreshButton(true).trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', '');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '340px', 'progress panel is shown');

        implementationsMap.getWidth = () => 1205;
        resizeCallbacks.fire();
        this.fileManager.option('width', '1205px');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', '');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '340px', 'progress panel is shown');
        assert.strictEqual(this.progressPanelWrapper.getInfosContainer().length, 1, 'progress panel content is still here');
        implementationsMap.getWidth = originalFunc;
    });

    test('progress panel image has fixed size (T1103197)', function(assert) {
        this.fileManager.option('notifications.showPanel', true);
        this.fileManager.option('customizeThumbnail', () => '../../testing/content/customFileIcon.png');
        this.clock.tick(400);

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');

        const details = infos[0].details;
        assert.equal(details.length, 1, 'one detail item rendered');

        assert.strictEqual(details[0].$image.css('width'), '36px', 'detail item icon has correct width');
        assert.strictEqual(details[0].$image.css('height'), '36px', 'detail item icon has correct height');
    });

    test('upload operation must be finalized correctly when notifications.showPanel is false (T1136702)', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;
        resizeCallbacks.fire();

        const uploadChunkSpy = sinon.spy();
        const operationDelay = 1500;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'u',
                realProviderInstance: new CustomFileSystemProvider({
                    uploadFileChunk: uploadChunkSpy
                }),
                exceptionThrown: e => {
                    assert.deepEqual(e, {}, 'An exception was thrown when it shouldn\'t be.');
                }
            }),
            notifications: {
                showPanel: false
            }
        });
        this.clock.tick(500);

        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations');

        this.wrapper.setUploadInputFile(createUploaderFiles(1));

        this.clock.tick(operationDelay * 2 + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'file is uploaded');
        assert.ok(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is visible');

        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('margin-right'), '0px', 'progress panel is hidden');
        assert.strictEqual(this.wrapper.getProgressPaneDrawerPanelContent().css('width'), '0px', 'progress panel is hidden');
        implementationsMap.getWidth = originalFunc;
    });
});
