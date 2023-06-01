import { getHeight, getWidth } from 'core/utils/size';
import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data, showTaskEditDialog, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('FullScreen Mode', moduleConfig, () => {
    test('FullScreen is switching', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick(10);
        this.instance.option('height', 200);
        this.clock.tick(10);
        const fullScreenCommand = getGanttViewCore(this.instance).commandManager.getCommand(10);

        assert.strictEqual(getGanttViewCore(this.instance).fullScreenModeHelper.isInFullScreenMode, false, 'Normal mode is enabled');
        this.clock.tick(10);
        fullScreenCommand.executeInternal();
        this.clock.tick(10);
        assert.strictEqual(getGanttViewCore(this.instance).fullScreenModeHelper.isInFullScreenMode, true, 'FullScreen mode is enabled');
        fullScreenCommand.execute();
        assert.strictEqual(getGanttViewCore(this.instance).fullScreenModeHelper.isInFullScreenMode, false, 'Normal mode is enabled after FullScreen mode');

    });
    test('is taking up entire screen', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick(10);
        this.instance.option('height', 200);
        this.instance.option('width', 400);
        this.instance.option('taskListWidth', 200);
        this.clock.tick(10);
        const fullScreenCommand = getGanttViewCore(this.instance).commandManager.getCommand(10);
        assert.ok(getHeight(this.instance.$element()) < getHeight($(window)), '1.normalMode: gantt height < window height');
        assert.ok(getWidth(this.instance.$element()) < getWidth($(window)), '1.normalMode: gantt width < window width');
        fullScreenCommand.execute();
        assert.equal(getHeight(this.instance.$element()), getHeight($(window)), '1.fullScreenMode: gantt height == window height');
        assert.equal(getWidth(this.instance.$element()), getWidth($(window)), '1.fullScreenMode: gantt width == window width');
        fullScreenCommand.execute();
        this.clock.tick(10);
        assert.ok(getHeight(this.instance.$element()) < getHeight($(window)), '2.normalMode: gantt height < window height');
        assert.ok(getWidth(this.instance.$element()) < getWidth($(window)), '2.normalMode: gantt width < window width');
        fullScreenCommand.execute();
        assert.equal(getHeight(this.instance.$element()), getHeight($(window)), '2.fullScreenMode: gantt height == window height');
        assert.equal(getWidth(this.instance.$element()), getWidth($(window)), '2.fullScreenMode: gantt width == window width');
        fullScreenCommand.execute();
    });

    test('task editng is possible', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
        const fullScreenCommand = getGanttViewCore(this.instance).commandManager.getCommand(10);
        fullScreenCommand.execute();
        assert.strictEqual(getGanttViewCore(this.instance).fullScreenModeHelper.isInFullScreenMode, true, 'FullScreen mode is enabled');
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        let $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const $inputs = $dialog.find(Consts.INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), data.tasks[0].title, 'title text is shown');
        assert.equal((new Date($inputs.eq(1).val())).getTime(), data.tasks[0].start.getTime(), 'start task text is shown');
        assert.equal((new Date($inputs.eq(2).val())).getTime(), data.tasks[0].end.getTime(), 'end task text is shown');
        assert.equal($inputs.eq(3).val(), data.tasks[0].progress + '%', 'progress text is shown');

        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick(10);
        const firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');

        this.instance.option('editing.enabled', false);
        showTaskEditDialog(this.instance);
        assert.equal($dialog.find('.dx-popup-bottom').find('.dx-button').length, 1, 'only cancel button in toolbar');
        $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.attr('readOnly'), 'readonly', 'all inputs is readOnly');
        fullScreenCommand.execute();
    });
    test('panel sizes are the same', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const fullScreenCommand = getGanttViewCore(this.instance).commandManager.getCommand(10);
        let leftPanelWidth = this.instance._splitter._leftPanelPercentageWidth;
        fullScreenCommand.execute();
        assert.equal(Math.floor(leftPanelWidth), Math.floor(this.instance._splitter._leftPanelPercentageWidth), 'left Panel Width is not changed in FullScreen');
        fullScreenCommand.execute();
        this.clock.tick(10);
        const diff = Math.abs(leftPanelWidth - Math.floor(this.instance._splitter._leftPanelPercentageWidth));
        assert.ok(diff < 2, 'left Panel Width is not changed in NormalMode');
        this.clock.tick(10);
        fullScreenCommand.execute();
        const splitterWrapper = this.$element.find(Consts.SPLITTER_WRAPPER_SELECTOR);
        const splitter = this.$element.find(Consts.SPLITTER_SELECTOR);

        const treeListWrapperElement = this.$element.find(Consts.TREELIST_WRAPPER_SELECTOR);
        const treeListWrapperLeftOffset = treeListWrapperElement.offset().left;
        const treeListWrapperTopOffset = treeListWrapperElement.offset().top;

        const ganttView = this.$element.find(Consts.GANTT_VIEW_SELECTOR);

        const splitterContainerWrapperWidth = getWidth($(treeListWrapperElement).parent());

        assert.ok(splitterWrapper, 'Splitter wrapper has been found');
        assert.ok(splitter, 'Splitter has been found');

        splitter.trigger($.Event('dxpointerdown', { pointerType: 'mouse' }));
        splitter.trigger($.Event('dxpointermove', {
            pointerType: 'mouse',
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 100,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup', { pointerType: 'mouse' }));

        assert.equal(getWidth(treeListWrapperElement), 100);
        assert.equal(getWidth(ganttView), splitterContainerWrapperWidth - 100);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 100, 'Splitter has been moved by mouse');

        splitter.trigger($.Event('dxpointerdown', { pointerType: 'touch' }));
        splitter.trigger($.Event('dxpointermove', {
            pointerType: 'touch',
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 300,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup', { pointerType: 'touch' }));

        assert.equal(getWidth(treeListWrapperElement), 300);
        assert.equal(getWidth(ganttView), splitterContainerWrapperWidth - 300);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 300, 'Splitter has been moved by touch');

        splitter.trigger($.Event('dxpointerdown'));
        splitter.trigger($.Event('dxpointermove', {
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) - 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup'));

        assert.equal(getWidth(treeListWrapperElement), 0);
        assert.equal(getWidth(ganttView), splitterContainerWrapperWidth);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 0, 'Splitter has not cross the left side');

        splitter.trigger($.Event('dxpointerdown'));
        splitter.trigger($.Event('dxpointermove', {
            pageX: splitterContainerWrapperWidth - parseFloat(splitter.css('margin-left')) + 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup'));

        assert.equal(getWidth(treeListWrapperElement), splitterContainerWrapperWidth - getWidth(splitter));
        assert.equal(getWidth(ganttView), getWidth(splitter));
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), splitterContainerWrapperWidth - getWidth(splitter), 'Splitter has not cross the right side');
        leftPanelWidth = this.instance._splitter._leftPanelPercentageWidth;
        fullScreenCommand.execute();
        assert.equal(Math.floor(leftPanelWidth), Math.floor(this.instance._splitter._leftPanelPercentageWidth), 'left Panel Width is not changed in Normal mode');
    });
});
