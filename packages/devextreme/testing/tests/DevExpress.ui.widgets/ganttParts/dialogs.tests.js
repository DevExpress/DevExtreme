import $ from 'jquery';
import messageLocalization from 'common/core/localization/message';
import 'ui/gantt';
import { Consts, data, options, showTaskEditDialog, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Dialogs', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        assert.equal($('body').find(Consts.POPUP_SELECTOR).length, 1, 'dialog is shown');
        this.instance.repaint();
        assert.equal($('body').find(Consts.POPUP_SELECTOR).length, 0, 'dialog is missed after widget repainting');
        this.clock.tick(10);

        showTaskEditDialog(this.instance);
        assert.equal($('body').find(Consts.POPUP_SELECTOR).length, 1, 'dialog is shown');
        this.instance.dispose();
        assert.equal($('body').find(Consts.POPUP_SELECTOR).length, 0, 'dialog is missed after widget disposing');
    });
    test('task editing', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
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
        const startTextBox = $dialog.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endTextBox = $dialog.find('.dx-datebox').eq(1).dxDateBox('instance');
        startTextBox.option('value', '');
        endTextBox.option('value', '');
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        assert.equal($dialog.length, 1, 'dialog is shown');
        let isValidStartTextBox = startTextBox._getValidationErrors() === null;
        let isValidEndTextBox = endTextBox._getValidationErrors() === null;
        assert.notOk(isValidStartTextBox, 'empty start validation');
        assert.notOk(isValidEndTextBox, 'empty end validation');
        titleTextBox.option('value', testTitle);
        startTextBox.option('value', data.tasks[0].start);
        endTextBox.option('value', data.tasks[0].end);
        isValidStartTextBox = startTextBox._getValidationErrors() === null;
        isValidEndTextBox = endTextBox._getValidationErrors() === null;
        assert.ok(isValidStartTextBox, 'not empty start validation');
        assert.ok(isValidEndTextBox, 'not empty end validation');
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
    });
    test('showTaskDetailsDialog', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        this.instance.showTaskDetailsDialog(1);
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
        const startTextBox = $dialog.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endTextBox = $dialog.find('.dx-datebox').eq(1).dxDateBox('instance');
        startTextBox.option('value', '');
        endTextBox.option('value', '');
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        assert.equal($dialog.length, 1, 'dialog is shown');
        let isValidStartTextBox = startTextBox._getValidationErrors() === null;
        let isValidEndTextBox = endTextBox._getValidationErrors() === null;
        assert.notOk(isValidStartTextBox, 'empty start validation');
        assert.notOk(isValidEndTextBox, 'empty end validation');
        titleTextBox.option('value', testTitle);
        startTextBox.option('value', data.tasks[0].start);
        endTextBox.option('value', data.tasks[0].end);
        isValidStartTextBox = startTextBox._getValidationErrors() === null;
        isValidEndTextBox = endTextBox._getValidationErrors() === null;
        assert.ok(isValidStartTextBox, 'not empty start validation');
        assert.ok(isValidEndTextBox, 'not empty end validation');
        $okButton.trigger('dxclick');
        this.clock.tick(10);
        const firstTreeListTitleText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');

        this.instance.option('editing.enabled', false);
        this.instance.showTaskDetailsDialog(1);
        this.clock.tick(10);
        assert.equal($dialog.find('.dx-popup-bottom').find('.dx-button').length, 1, 'only cancel button in toolbar');
        $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.attr('readOnly'), 'readonly', 'all inputs is readOnly');
    });
    test('resources editing', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        getGanttViewCore(this.instance).commandManager.showResourcesDialog.execute();
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        let $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, data.resources.length, 'dialog has all resources');

        const $deleteButtons = $dialog.find('.dx-list-static-delete-button');
        $deleteButtons.eq(0).trigger('dxclick');
        $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, data.resources.length - 1, 'first resource removed from list');

        const secondResourceText = data.resources[1].text;
        const thirdResourceText = data.resources[2].text;
        const newResourceText = 'newResource';
        const textBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        textBox.option('text', newResourceText);
        const $addButton = $dialog.find('.dx-button-has-text').eq(0);
        $addButton.dxButton('instance').option('disabled', false);
        $addButton.trigger('dxclick');
        $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, data.resources.length, 'added resource to list');

        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick(10);

        const $confirmDialog = $('body').find(Consts.POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick(10);

        assert.equal(data.resources[0].text, secondResourceText, 'first resource removed from ds');
        assert.equal(data.resources[1].text, thirdResourceText, 'second resource ds');
        assert.equal(data.resources[2].text, newResourceText, 'new resource ds');
    });
    test('task progress not reset check (T890805)', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const $inputs = $dialog.find(Consts.INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), data.tasks[0].title, 'title text is shown');
        assert.equal($inputs.eq(3).val(), data.tasks[0].progress + '%', 'progress text is shown');

        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.tasks[0].progress, 31, 'progress reset');
    });
    test('showing taskEditDialog after resources dialog is closed', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const expectedTaskEditTitleText = messageLocalization.format('dxGantt-dialogTaskDetailsTitle');
        let popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedTaskEditTitleText, popupTitleText, 'taskEditPopup title');

        const $showResourcesButton = $dialog.find('.dx-texteditor-buttons-container').find('.dx-button').eq(0);
        $showResourcesButton.trigger('dxclick');
        this.clock.tick(10);

        const expectedResourceTitleText = messageLocalization.format('dxGantt-dialogResourceManagerTitle');
        popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedResourceTitleText, popupTitleText, 'resourcePopup title');

        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick(10);

        popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedTaskEditTitleText, popupTitleText, 'taskEditPopup title shown again');
    });
    test('assign resource dxTagBox is disabled when allowTaskResourceUpdating is false', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('editing.allowTaskResourceUpdating', false);

        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const tagBox = $dialog.find('.dx-tag-container > .dx-texteditor-input');
        assert.ok(tagBox.attr('aria-readOnly'), 'resource tagBox is readOnly');
    });
    test('show edit resource dialog button is disabled when allowResourceAdding and allowResourceDeleting are false ', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('editing.allowResourceAdding', false);
        this.instance.option('editing.allowResourceDeleting', false);

        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const button = $dialog.find('.dx-texteditor-buttons-container > .dx-button');
        assert.ok(button.attr('aria-disabled'), 'button is disabled');
    });
    test('task edit dialog not shown on new task adding (T1110285)', function(assert) {

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
            editing: { enabled: true },
            selectedRowKey: 1
        };

        this.createInstance(options);
        this.clock.tick(10);

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        const dialogInstance = this.instance._dialogInstance._popupInstance;
        dialogInstance.option('showCloseButton', true);

        assert.ok(dialogInstance.option('visible'), 'dialog is visible');
        assert.equal($dialog.length, 1, 'dialog exists');
        const $closeButton = $('.dx-closebutton');
        $closeButton.triggerHandler('dxclick');
        this.clock.tick(1000);

        assert.notOk(dialogInstance.option('visible'), 'dialog is not visible');
        // insert task

        const taskData = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
        };

        this.instance.insertTask(taskData);
        this.clock.tick(1000);
        assert.notOk(dialogInstance.option('visible'), 'dialog is not visible');
    });
});
