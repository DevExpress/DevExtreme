import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { DiagramCommand } from 'devexpress-diagram';
import { Consts, getMainToolbarInstance, getContextMenuInstance, findToolbarItem, getToolbarIcon, findContextMenuItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram({
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
        const undoButton = findToolbarItem(this.$element, 'undo').dxButton('instance');
        assert.ok(undoButton.option('disabled'));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option('disabled'));
    });
    test('should activate items on diagram request', function(assert) {
        assert.ok(findToolbarItem(this.$element, 'center').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findToolbarItem(this.$element, 'left').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findToolbarItem(this.$element, 'center').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findToolbarItem(this.$element, 'left').hasClass(Consts.TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test('button should raise diagram commands', function(assert) {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findToolbarItem(this.$element, 'left').trigger('dxclick');
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test('button should raise custom commands', function(assert) {
        this.onCustomClick = sinon.spy();
        this.onCustomClick2 = sinon.spy();
        this.instance.option('mainToolbar.commands', [
            {
                text: 'custom',
                onClick: this.onCustomClick
            },
            {
                text: 'sub menu',
                items: [{
                    text: 'custom2',
                    onClick: this.onCustomClick2,
                }]
            }
        ]);
        findToolbarItem(this.$element, 'custom').trigger('dxclick');
        assert.ok(this.onCustomClick.called);
        findToolbarItem(this.$element, 'sub menu').trigger('dxclick');
        findContextMenuItem(this.$element, 'custom2').trigger('dxclick');
        assert.ok(this.onCustomClick2.called);
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
        const $selectButtonTemplates = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-select-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'select buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorboxes should be replaced with color buttons', function(assert) {
        const $selectButtonTemplates = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'color buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i, .dx-icon').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorbuttons should show an active color', function(assert) {
        const colorButton = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
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
        const colorButton = this.$element.find(Consts.MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
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
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('diagram should be focused after set font bold', function(assert) {
        const boldButton = findToolbarItem(this.$element, 'bold');
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        boldButton.trigger('dxclick');
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('Auto Layout button should be disabled when there is no selection', function(assert) {
        const button = findToolbarItem(this.$element, 'layout').dxButton('instance');
        assert.ok(button.option('disabled'));
    });
    test('Auto Layout button should be disabled in Read Only mode', function(assert) {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(Consts.SIMPLE_DIAGRAM);
        const contextMenu = getContextMenuInstance(this.$element);
        contextMenu.show();
        findContextMenuItem(this.$element, 'select all').trigger('dxclick');
        const button = findToolbarItem(this.$element, 'layout').dxButton('instance');
        assert.notOk(button.option('disabled'));
        this.instance.option('readOnly', true);
        assert.ok(button.option('disabled'));
    });
});
