import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';
import { DiagramCommand } from 'devexpress-diagram';
import { SIMPLE_DIAGRAM } from '../diagram.tests.js';

const MAIN_TOOLBAR_SELECTOR = '.dx-diagram-toolbar-wrapper > .dx-diagram-toolbar';
const CONTEXT_MENU_SELECTOR = 'div:not(.dx-diagram-toolbar-wrapper):not(.dx-diagram-floating-toolbar-container) > .dx-has-context-menu';
const TOOLBAR_ITEM_ACTIVE_CLASS = 'dx-format-active';
const DX_MENU_ITEM_SELECTOR = '.dx-menu-item';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
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
        this.instance.option('toolbar.visible', false);
        const $toolbar = this.$element.find(MAIN_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 0);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = this.$element.find(MAIN_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.ok(toolbar.option('dataSource').length > 10);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('toolbar.commands', ['exportSvg']);
        let toolbar = this.$element.find(MAIN_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 2); // + show properties panel

        this.instance.option('propertiesPanel.enabled', false);
        toolbar = this.$element.find(MAIN_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1);
        this.instance.option('propertiesPanel.enabled', true);
        this.instance.option('propertiesPanel.collapsible', false);
        toolbar = this.$element.find(MAIN_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1);
    });
    test('should enable items on diagram request', function(assert) {
        const undoButton = findToolbarItem(this.$element, 'undo').dxButton('instance');
        assert.ok(undoButton.option('disabled'));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option('disabled'));
    });
    test('should activate items on diagram request', function(assert) {
        assert.ok(findToolbarItem(this.$element, 'center').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findToolbarItem(this.$element, 'left').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findToolbarItem(this.$element, 'center').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findToolbarItem(this.$element, 'left').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test('button should raise diagram commands', function(assert) {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findToolbarItem(this.$element, 'left').trigger('dxclick');
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test('selectBox should raise diagram commands', function(assert) {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial');
        const fontSelectBox = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.option('value', 'Arial Black');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial Black');
    });
    test('selectboxes with icon items should be replaced with select buttons', function(assert) {
        const $selectButtonTemplates = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-select-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'select buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorboxes should be replaced with color buttons', function(assert) {
        const $selectButtonTemplates = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'color buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i, .dx-icon').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorbuttons should show an active color', function(assert) {
        const colorButton = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
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
        const colorButton = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
        const colorBox = colorButton.find('.dx-colorbox').dxColorBox('instance');
        getToolbarIcon(colorButton).trigger('dxclick');
        assert.ok(colorBox.option('opened'), true);
    });
    test('diagram should be focused after change font family', function(assert) {
        const fontSelectBox = this.$element.find(MAIN_TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
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
        const button = findToolbarItem(this.$element, 'auto layout').dxButton('instance');
        assert.ok(button.option('disabled'));
    });
    test('Auto Layout button should be disabled in Read Only mode', function(assert) {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        contextMenu.show();
        $(contextMenu.itemsContainer().find(DX_MENU_ITEM_SELECTOR).eq(0)).trigger('dxclick'); // Select All
        const button = findToolbarItem(this.$element, 'auto layout').dxButton('instance');
        assert.notOk(button.option('disabled'));
        this.instance.option('readOnly', true);
        assert.ok(button.option('disabled'));
    });
});

function getToolbarIcon(button) {
    return button.find('.dx-dropdowneditor-field-template-wrapper').find('.dx-diagram-i, .dx-icon');
}
function findToolbarItem($diagramElement, label) {
    return $diagramElement.find(MAIN_TOOLBAR_SELECTOR)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
