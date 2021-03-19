import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { DiagramCommand } from 'devexpress-diagram';
import { Consts, getMainToolbarInstance, findMainToolbarItem, getToolbarIcon, findContextMenuItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.onCustomCommand = sinon.spy();
        this.$element = $('#diagram').dxDiagram({
            onCustomCommand: this.onCustomCommand,
            mainToolbar: {
                visible: true
            }
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Main Toolbar', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if toolbar.visible is false', function(assert) {
        this.instance.option('mainToolbar.visible', false);
        const $toolbar = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 0);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = getMainToolbarInstance(this.$element);
        assert.ok(toolbar.option('dataSource').length > 10);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('mainToolbar.commands', ['exportSvg']);
        const toolbar = getMainToolbarInstance(this.$element);
        assert.equal(toolbar.option('dataSource').length, 1);
    });
    test('should enable items on diagram request', function(assert) {
        const undoButton = findMainToolbarItem(this.$element, 'undo').dxButton('instance');
        assert.ok(undoButton.option('disabled'));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option('disabled'));
    });
    test('should activate items on diagram request', function(assert) {
        assert.ok(findMainToolbarItem(this.$element, 'center').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findMainToolbarItem(this.$element, 'left').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findMainToolbarItem(this.$element, 'center').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findMainToolbarItem(this.$element, 'left').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test('button should raise diagram commands', function(assert) {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findMainToolbarItem(this.$element, 'left').trigger('dxclick');
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test('button should raise custom commands', function(assert) {
        this.instance.option('mainToolbar.commands', [
            {
                name: 'custom1',
                text: 'custom1',
            },
            {
                name: 'bold',
                text: 'custom bold',
            },
            {
                text: 'sub menu',
                items: [{
                    name: 'custom2',
                    text: 'custom2'
                }, {
                    name: 'italic',
                    text: 'custom italic'
                }]
            }
        ]);

        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).getState().value);
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Italic).getState().value);

        findMainToolbarItem(this.$element, 'custom1').trigger('dxclick');
        findMainToolbarItem(this.$element, 'custom bold').trigger('dxclick');
        findMainToolbarItem(this.$element, 'sub menu').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom2').trigger('dxclick');
        findMainToolbarItem(this.$element, 'sub menu').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom italic').trigger('dxclick');
        assert.ok(this.onCustomCommand.called);
        assert.equal(this.onCustomCommand.getCalls().length, 4);
        assert.equal(this.onCustomCommand.getCall(0).args[0]['name'], 'custom1');
        assert.equal(this.onCustomCommand.getCall(1).args[0]['name'], 'bold');
        assert.equal(this.onCustomCommand.getCall(2).args[0]['name'], 'custom2');
        assert.equal(this.onCustomCommand.getCall(3).args[0]['name'], 'italic');

        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Bold).getState().value);
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Italic).getState().value);
    });
    test('selectBox should have items', function(assert) {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial');
        const fontSelectBox = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        assert.ok(fontSelectBox.option('dataSource').length > 0);
    });
    test('selectBox should raise diagram commands', function(assert) {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial');
        const fontSelectBox = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.option('value', 'Arial Black');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial Black');
    });
    test('selectboxes with icon items should be replaced with select buttons', function(assert) {
        const $selectButtonTemplates = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-image-dropdown-item').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'select buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorboxes should be replaced with color buttons', function(assert) {
        const $selectButtonTemplates = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-edit-item').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'color buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i, .dx-icon').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorbuttons should show an active color', function(assert) {
        const colorButton = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-edit-item').first();
        assert.equal(getToolbarIcon(colorButton).css('borderBottomColor'), 'rgb(0, 0, 0)');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontColor).execute('rgb(255, 0, 0)');
        assert.equal(getToolbarIcon(colorButton).css('borderBottomColor'), 'rgb(255, 0, 0)', 'button changed via command');
        colorButton.find('.dx-dropdowneditor-button').trigger('dxclick');
        const $overlayContent = $('.dx-colorbox-overlay');
        $overlayContent.find('.dx-colorview-label-hex').find('.dx-textbox').dxTextBox('instance').option('value', '00ff00');
        $overlayContent.find('.dx-colorview-buttons-container .dx-colorview-apply-button').trigger('dxclick');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontColor).getState().value, '#00ff00', 'color changed by color button');
        assert.equal(getToolbarIcon(colorButton).css('borderBottomColor'), 'rgb(0, 255, 0)', 'button changed via coloredit');
    });
    test('colorbutton should show dropdown on icon click', function(assert) {
        const colorButton = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-edit-item').first();
        const colorBox = colorButton.find('.dx-colorbox').dxColorBox('instance');
        getToolbarIcon(colorButton).trigger('dxclick');
        assert.ok(colorBox.option('opened'), true);
    });
    test('diagram should be focused after change font family', function(assert) {
        const fontSelectBox = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.focus();
        fontSelectBox.open();
        const item = $(document).find('.dx-list-item-content').filter(function() {
            return $(this).text().toLowerCase().indexOf('arial black') >= 0;
        });
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        item.trigger('dxclick');
        this.clock.tick(200);
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('diagram should be focused after set font bold', function(assert) {
        const boldButton = findMainToolbarItem(this.$element, 'bold');
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        boldButton.trigger('dxclick');
        this.clock.tick(200);
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('Auto Layout button should be disabled in Read Only mode', function(assert) {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SelectAll).execute(true);
        const button = findMainToolbarItem(this.$element, 'layout').dxButton('instance');
        assert.notOk(button.option('disabled'));
        this.instance.option('readOnly', true);
        assert.ok(button.option('disabled'));
    });
});
