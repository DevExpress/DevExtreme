import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';
import { DiagramCommand, Browser } from 'devexpress-diagram';

QUnit.testStart(() => {
    const markup = '<style>.dxdi-control { width: 100%; height: 100%; overflow: auto; box-sizing: border-box; position: relative; }</style><div id="diagram"></div>';
    $('#qunit-fixture').html(markup);
});

const TOOLBAR_SELECTOR = '.dx-diagram-toolbar';
const TOOBOX_ACCORDION_SELECTOR = '.dx-diagram-left-panel .dx-accordion';
const CONTEXT_MENU_SELECTOR = 'div:not(.dx-diagram-toolbar-wrapper) > .dx-has-context-menu';
const PROPERTIES_PANEL_ACCORDION_SELECTOR = '.dx-diagram-right-panel .dx-accordion';
const PROPERTIES_PANEL_FORM_SELECTOR = '.dx-diagram-right-panel .dx-accordion .dx-form';
const TOOLBAR_ITEM_ACTIVE_CLASS = 'dx-format-active';
const MAIN_ELEMENT_SELECTOR = '.dxdi-control';
const SIMPLE_DIAGRAM = '{ "shapes": [{ "key":"107", "type":"Ellipsis", "text":"A new ticket", "x":1440, "y":1080, "width":1440, "height":720, "zIndex":0 }] }';
const DX_MENU_ITEM_SELECTOR = '.dx-menu-item';
const DIAGRAM_FULLSCREEN_CLASS = 'dx-diagram-fullscreen';

const moduleConfig = {
    beforeEach: () => {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

function getToolbarIcon(button) {
    return button.find('.dx-dropdowneditor-field-template-wrapper').find('.dx-diagram-i, .dx-icon');
}


QUnit.module('Diagram DOM Layout', {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach();
    },
    afterEach: () => {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should return correct size of document container in default options', (assert) => {
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });
    test('should return correct size of document container if options panel is hidden', (assert) => {
        this.instance.option('propertiesPanel.enabled', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if toolbox is hidden', (assert) => {
        this.instance.option('toolbox.visible', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if toolbar is hidden', (assert) => {
        this.instance.option('toolbar.visible', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if all UI is hidden', (assert) => {
        this.instance.option('toolbar.visible', false);
        this.instance.option('toolbox.visible', false);
        this.instance.option('propertiesPanel.enabled', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });


    function assertSizes(assert, $scrollContainer, $actualContainer, inst) {
        assert.equal($scrollContainer.width(), $actualContainer.width());
        assert.equal($scrollContainer.height(), $actualContainer.height());
        var coreScrollSize = inst._diagramInstance.render.view.scroll.getSize();
        assert.equal(coreScrollSize.width, $actualContainer.width());
        assert.equal(coreScrollSize.height, $actualContainer.height());
    }
});

QUnit.module('Diagram Toolbar', {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach();
    },
    afterEach: () => {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if toolbar.visible is false', (assert) => {
        this.instance.option('toolbar.visible', false);
        let $toolbar = this.$element.find(TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 0);
    });
    test('should fill toolbar with default items', (assert) => {
        let toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.ok(toolbar.option('dataSource').length > 10);
    });
    test('should fill toolbar with custom items', (assert) => {
        this.instance.option('toolbar.commands', ['export']);
        let toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 2); // + show properties panel

        this.instance.option('propertiesPanel.enabled', false);
        toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1);
        this.instance.option('propertiesPanel.enabled', true);
        this.instance.option('propertiesPanel.collapsible', false);
        toolbar = this.$element.find(TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1);
    });
    test('should enable items on diagram request', (assert) => {
        let undoButton = findToolbarItem(this.$element, 'undo').dxButton('instance');
        assert.ok(undoButton.option('disabled'));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(true);
        assert.notOk(undoButton.option('disabled'));
    });
    test('should activate items on diagram request', (assert) => {
        assert.ok(findToolbarItem(this.$element, 'center').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.notOk(findToolbarItem(this.$element, 'left').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).execute(true);
        assert.notOk(findToolbarItem(this.$element, 'center').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
        assert.ok(findToolbarItem(this.$element, 'left').hasClass(TOOLBAR_ITEM_ACTIVE_CLASS));
    });
    test('button should raise diagram commands', (assert) => {
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findToolbarItem(this.$element, 'left').trigger('dxclick');
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test('selectBox should raise diagram commands', (assert) => {
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial');
        const fontSelectBox = this.$element.find(TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.option('value', 'Arial Black');
        assert.equal(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.FontName).getState().value, 'Arial Black');
    });
    test('selectboxes with icon items should be replaced with select buttons', (assert) => {
        const $selectButtonTemplates = this.$element.find(TOOLBAR_SELECTOR).find('.dx-diagram-select-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'select buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorboxes should be replaced with color buttons', (assert) => {
        const $selectButtonTemplates = this.$element.find(TOOLBAR_SELECTOR).find('.dx-diagram-color-b').find('.dx-dropdowneditor-field-template-wrapper');
        assert.ok($selectButtonTemplates.length > 0, 'color buttons are rendered');
        const selectButtonsCount = $selectButtonTemplates.length;
        assert.equal($selectButtonTemplates.find('.dx-diagram-i, .dx-icon').length, selectButtonsCount, 'icons are rendered');
        assert.equal($selectButtonTemplates.find('.dx-textbox')[0].offsetWidth, 0, 'textbox is hidden');
    });
    test('colorbuttons should show an active color', (assert) => {
        const colorButton = this.$element.find(TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
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
    test('colorbutton should show dropdown on icon click', (assert) => {
        const colorButton = this.$element.find(TOOLBAR_SELECTOR).find('.dx-diagram-color-b').first();
        const colorBox = colorButton.find('.dx-colorbox').dxColorBox('instance');
        getToolbarIcon(colorButton).trigger('dxclick');
        assert.ok(colorBox.option('opened'), true);
    });
    test('call .update() after accordion item collapsing/expanding', (assert) => {
        const clock = sinon.useFakeTimers();
        const $leftPanel = this.$element.find('.dx-diagram-left-panel');
        const scrollView = $leftPanel.find('.dx-scrollview').dxScrollView('instance');
        const updateSpy = sinon.spy(scrollView, 'update');
        $leftPanel.find('.dx-accordion-item-title').first().trigger('dxclick');
        clock.tick(2000);
        assert.equal(updateSpy.callCount, 1, 'scrollView.update() called once');
        clock.restore();
    });
    test('should toggle fullscreen class name on button click', (assert) => {
        assert.notOk(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
        let fullScreenButton = findToolbarItem(this.$element, 'full screen');
        fullScreenButton.trigger('dxclick');
        assert.ok(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
        fullScreenButton.trigger('dxclick');
        assert.notOk(this.$element.hasClass(DIAGRAM_FULLSCREEN_CLASS));
    });
    test('diagram should be focused after change font family', (assert) => {
        const fontSelectBox = this.$element.find(TOOLBAR_SELECTOR).find('.dx-selectbox').eq(0).dxSelectBox('instance');
        fontSelectBox.focus();
        fontSelectBox.open();
        const item = $(document).find('.dx-list-item-content').filter(function() {
            return $(this).text().toLowerCase().indexOf('arial black') >= 0;
        });
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        item.trigger('dxclick');
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('diagram should be focused after set font bold', (assert) => {
        const boldButton = findToolbarItem(this.$element, 'bold');
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        boldButton.trigger('dxclick');
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
    test('Auto Layout button should be disabled when there is no selection', (assert) => {
        const button = findToolbarItem(this.$element, 'auto layout').dxButton('instance');
        assert.ok(button.option('disabled'));
    });
    test('Auto Layout button should be disabled in Read Only mode', (assert) => {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        if(Browser.TouchUI) {
            contextMenu.show();
        } else {
            $(this.$element.find(MAIN_ELEMENT_SELECTOR).eq(0)).trigger('dxcontextmenu');
        }
        $(contextMenu.itemsContainer().find(DX_MENU_ITEM_SELECTOR).eq(0)).trigger('dxclick'); // Select All
        const button = findToolbarItem(this.$element, 'auto layout').dxButton('instance');
        assert.notOk(button.option('disabled'));
        this.instance.option('readOnly', true);
        assert.ok(button.option('disabled'));
    });
});

QUnit.module('Diagram Toolbox', moduleConfig, () => {
    test('should not render if toolbox.visible is false', (assert) => {
        this.instance.option('toolbox.visible', false);
        let $accordion = this.$element.find(TOOBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should fill toolbox with default items', (assert) => {
        let accordion = this.$element.find(TOOBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.ok(accordion.option('dataSource').length > 1);
    });
    test('should fill toolbox with custom items', (assert) => {
        this.instance.option('toolbox.groups', ['general']);
        let accordion = this.$element.find(TOOBOX_ACCORDION_SELECTOR).dxAccordion('instance');
        assert.equal(accordion.option('dataSource').length, 1);
    });
});

QUnit.module('Diagram Properties Panel', moduleConfig, () => {
    test('should not render if propertiesPanel.enabled is false', (assert) => {
        this.instance.option('propertiesPanel.enabled', false);
        let $accordion = this.$element.find(PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should fill properties panel with default items', (assert) => {
        let form = this.$element.find(PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.ok(form.option('items').length > 1);
    });
    test('should fill toolbox with custom items', (assert) => {
        this.instance.option('propertiesPanel.groups', [{ commands: ['units'] }]);
        let form = this.$element.find(PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.equal(form.option('items').length, 1);
    });
});

QUnit.module('Context Menu', {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach();
    },
    afterEach: () => {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if contextMenu.enabled is false', (assert) => {
        let $contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 1);
        this.instance.option('contextMenu.enabled', false);
        $contextMenu = this.$element.children(CONTEXT_MENU_SELECTOR);
        assert.equal($contextMenu.length, 0);
    });
    test('should load default items', (assert) => {
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.ok(contextMenu.option('items').length > 1);
    });
    test('should load custom items', (assert) => {
        this.instance.option('contextMenu.commands', ['copy']);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.equal(contextMenu.option('items').length, 1);
    });
    test('should update items on showing', (assert) => {
        this.instance.option('contextMenu.commands', ['copy', 'selectAll']);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        assert.notOk(contextMenu.option('visible'));
        assert.ok(contextMenu.option('items')[0].text.indexOf('Copy') > -1);
        if(Browser.TouchUI) {
            contextMenu.show();
        } else {
            $(this.$element.find(MAIN_ELEMENT_SELECTOR).eq(0)).trigger('dxcontextmenu');
        }
        assert.ok(contextMenu.option('visible'));
        assert.ok(contextMenu.option('items')[0].text.indexOf('Select All') > -1);
    });
    test('should execute commands on click', (assert) => {
        this.instance.option('contextMenu.commands', ['selectAll']);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        const contextMenu = this.$element.find(CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
        if(Browser.TouchUI) {
            contextMenu.show();
        } else {
            $(this.$element.find(MAIN_ELEMENT_SELECTOR).eq(0)).trigger('dxcontextmenu');
        }
        assert.ok(this.instance._diagramInstance.selection.isEmpty());
        $(contextMenu.itemsContainer().find(DX_MENU_ITEM_SELECTOR).eq(0)).trigger('dxclick');
        assert.notOk(this.instance._diagramInstance.selection.isEmpty());
    });
});

QUnit.module('Options', moduleConfig, () => {
    test('should change readOnly property', (assert) => {
        assert.notOk(this.instance._diagramInstance.settings.readOnly);
        this.instance.option('readOnly', true);
        assert.ok(this.instance._diagramInstance.settings.readOnly);
        this.instance.option('readOnly', false);
        assert.notOk(this.instance._diagramInstance.settings.readOnly);
    });
    test('should change zoomLevel property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        this.instance.option('zoomLevel', 1.5);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1.5);
        this.instance.option('zoomLevel', 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
    });
    test('should sync zoomLevel property', (assert) => {
        assert.equal(this.instance.option('zoomLevel'), 1);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(1.5);
        assert.equal(this.instance.option('zoomLevel'), 1.5);
    });
    test('should change zoomLevel object property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 7);
        this.instance.option('zoomLevel', { value: 1.5, items: [ 1, 1.5 ] });
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1.5);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 2);
        this.instance.option('zoomLevel', 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevel, 1);
        assert.equal(this.instance._diagramInstance.settings.zoomLevelItems.length, 2);
    });
    test('should sync zoomLevel object property', (assert) => {
        this.instance.option('zoomLevel', { value: 1.5, items: [ 1, 1.5, 2 ] });
        assert.equal(this.instance.option('zoomLevel.value'), 1.5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ZoomLevel).execute(2);
        assert.equal(this.instance.option('zoomLevel.value'), 2);
    });
    test('should change autoZoom property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
        this.instance.option('autoZoom', 'fitContent');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 1);
        this.instance.option('autoZoom', 'fitWidth');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 2);
        this.instance.option('autoZoom', 'disabled');
        assert.equal(this.instance._diagramInstance.settings.autoZoom, 0);
    });
    test('should sync autoZoom property', (assert) => {
        assert.equal(this.instance.option('autoZoom'), 'disabled');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SwitchAutoZoom).execute(1);
        assert.equal(this.instance.option('autoZoom'), 'fitContent');
    });
    test('should change fullScreen property', (assert) => {
        assert.notOk(this.instance._diagramInstance.settings.fullscreen);
        this.instance.option('fullScreen', true);
        assert.ok(this.instance._diagramInstance.settings.fullscreen);
        this.instance.option('fullScreen', false);
        assert.notOk(this.instance._diagramInstance.settings.fullscreen);
    });
    test('should sync fullScreen property', (assert) => {
        assert.equal(this.instance.option('fullScreen'), false);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Fullscreen).execute(true);
        assert.equal(this.instance.option('fullScreen'), true);
    });
    test('should change showGrid property', (assert) => {
        assert.ok(this.instance._diagramInstance.settings.showGrid);
        this.instance.option('showGrid', false);
        assert.notOk(this.instance._diagramInstance.settings.showGrid);
        this.instance.option('showGrid', true);
        assert.ok(this.instance._diagramInstance.settings.showGrid);
    });
    test('should sync showGrid property', (assert) => {
        assert.equal(this.instance.option('showGrid'), true);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ShowGrid).execute(false);
        assert.equal(this.instance.option('showGrid'), false);
    });
    test('should change snapToGrid property', (assert) => {
        assert.ok(this.instance._diagramInstance.settings.snapToGrid);
        this.instance.option('snapToGrid', false);
        assert.notOk(this.instance._diagramInstance.settings.snapToGrid);
        this.instance.option('snapToGrid', true);
        assert.ok(this.instance._diagramInstance.settings.snapToGrid);
    });
    test('should sync snapToGrid property', (assert) => {
        assert.equal(this.instance.option('snapToGrid'), true);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.SnapToGrid).execute(false);
        assert.equal(this.instance.option('snapToGrid'), false);
    });
    test('should change gridSize property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        this.instance.option('gridSize', 0.25);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 360);
        this.instance.option('gridSize', 0.125);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
    });
    test('should sync gridSize property', (assert) => {
        assert.equal(this.instance.option('gridSize'), 0.125);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(0.25);
        assert.equal(this.instance.option('gridSize'), 0.25);
    });
    test('should change gridSize object property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 4);
        this.instance.option('gridSize', { value: 0.25, items: [0.25, 1] });
        assert.equal(this.instance._diagramInstance.settings.gridSize, 360);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 2);
        this.instance.option('gridSize', 0.125);
        assert.equal(this.instance._diagramInstance.settings.gridSize, 180);
        assert.equal(this.instance._diagramInstance.settings.gridSizeItems.length, 2);
    });
    test('should sync gridSize object property', (assert) => {
        this.instance.option('gridSize', { value: 0.25, items: [0.125, 0.25, 1] });
        assert.equal(this.instance.option('gridSize.value'), 0.25);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.GridSize).execute(1);
        assert.equal(this.instance.option('gridSize.value'), 1);
    });
    test('should change viewUnits property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 0);
        this.instance.option('viewUnits', 'cm');
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 1);
        this.instance.option('viewUnits', 'in');
        assert.equal(this.instance._diagramInstance.settings.viewUnits, 0);
    });
    test('should sync viewUnits property', (assert) => {
        assert.equal(this.instance.option('viewUnits'), 'in');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ViewUnits).execute(1);
        assert.equal(this.instance.option('viewUnits'), 'cm');
    });
    test('should change units property', (assert) => {
        assert.equal(this.instance._diagramInstance.model.units, 0);
        this.instance.option('units', 'cm');
        assert.equal(this.instance._diagramInstance.model.units, 1);
        this.instance.option('units', 'in');
        assert.equal(this.instance._diagramInstance.model.units, 0);
    });
    test('should change pageSize property', (assert) => {
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 8391);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 11906);
        this.instance.option('pageSize', { width: 3, height: 5 });
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 4320);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 7200);
    });
    test('should sync pageSize property', (assert) => {
        this.instance.option('pageSize', { width: 3, height: 5 });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
    });
    test('should change pageSize object property', (assert) => {
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 8391);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 11906);
        assert.equal(this.instance._diagramInstance.settings.pageSizeItems.length, 11);
        this.instance.option('pageSize', { width: 3, height: 5, items: [{ width: 3, height: 5, text: 'A10' }] });
        assert.equal(this.instance._diagramInstance.model.pageSize.width, 4320);
        assert.equal(this.instance._diagramInstance.model.pageSize.height, 7200);
        assert.equal(this.instance._diagramInstance.settings.pageSizeItems.length, 1);
    });
    test('should sync pageSize object property', (assert) => {
        this.instance.option('pageSize', { width: 3, height: 5, items: [{ width: 3, height: 5, text: 'A10' }, { width: 4, height: 6, text: 'A11' }] });
        assert.equal(this.instance.option('pageSize.width'), 3);
        assert.equal(this.instance.option('pageSize.height'), 5);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageSize).execute({ width: 4, height: 6 });
        assert.equal(this.instance.option('pageSize.width'), 4);
        assert.equal(this.instance.option('pageSize.height'), 6);
    });
    test('should change pageOrientation property', (assert) => {
        assert.equal(this.instance._diagramInstance.model.pageLandscape, false);
        this.instance.option('pageOrientation', 'landscape');
        assert.equal(this.instance._diagramInstance.model.pageLandscape, true);
        this.instance.option('pageOrientation', 'portrait');
        assert.equal(this.instance._diagramInstance.model.pageLandscape, false);
    });
    test('should sync pageOrientation property', (assert) => {
        assert.equal(this.instance.option('pageOrientation'), 'portrait');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageLandscape).execute(1);
        assert.equal(this.instance.option('pageOrientation'), 'landscape');
    });
    test('should change pageColor property', (assert) => {
        assert.equal(this.instance._diagramInstance.model.pageColor, -1); // FFFFFF
        this.instance.option('pageColor', 'red');
        assert.equal(this.instance._diagramInstance.model.pageColor, -65536); // FF0000
        this.instance.option('pageColor', 'white');
        assert.equal(this.instance._diagramInstance.model.pageColor, -1); // FFFFFF
    });
    test('should sync pageColor property', (assert) => {
        assert.equal(this.instance.option('pageColor'), '#ffffff');
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.PageColor).execute('red');
        assert.equal(this.instance.option('pageColor'), '#ff0000'); // FF0000
    });
    test('should change simpleView property', (assert) => {
        assert.equal(this.instance._diagramInstance.settings.simpleView, false);
        this.instance.option('simpleView', true);
        assert.equal(this.instance._diagramInstance.settings.simpleView, true);
        this.instance.option('simpleView', false);
        assert.equal(this.instance._diagramInstance.settings.simpleView, false);
    });
    test('should sync simpleView property', (assert) => {
        assert.equal(this.instance.option('simpleView'), false);
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.ToggleSimpleView).execute(true);
        assert.equal(this.instance.option('simpleView'), true);
    });
});

QUnit.module('ClientSideEvents', {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach();
    },
    afterEach: () => {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('click on unbound diagram', (assert) => {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        var clickedItem;
        this.instance.option('onItemClick', function(e) {
            clickedItem = e.item;
        });
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShape('107').toNative());
        assert.equal(clickedItem.id, '107');
        assert.equal(clickedItem.text, 'A new ticket');
    });
    test('selectionchanged on unbound diagram', (assert) => {
        this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(SIMPLE_DIAGRAM);
        var selectedItems;
        this.instance.option('onSelectionChanged', function(e) {
            selectedItems = e.items;
        });
        this.instance._diagramInstance.selection.set([this.instance._diagramInstance.model.findShape('107').key]);
        assert.equal(selectedItems.length, 1);
        assert.equal(selectedItems[0].id, '107');
        assert.equal(selectedItems[0].text, 'A new ticket');
    });
    test('click on bound diagram', (assert) => {
        this.instance.option('nodes.keyExpr', 'key');
        this.instance.option('nodes.textExpr', 'text');
        this.instance.option('edges.keyExpr', 'key');
        this.instance.option('edges.fromKey', 'from');
        this.instance.option('edges.toKey', 'to');
        this.instance.option('nodes.dataSource', [
            { key: '123', text: 'mytext', foo: 'bar' },
            { key: '345', text: 'myconnector' }
        ]);
        this.instance.option('edges.dataSource', [
            { key: '1', from: '123', to: '345' }
        ]);
        var clickedItem, dblClickedItem;
        this.instance.option('onItemClick', function(e) {
            clickedItem = e.item;
        });
        this.instance.option('onItemDblClick', function(e) {
            dblClickedItem = e.item;
        });
        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative());
        assert.equal(clickedItem.dataItem.key, '123');
        assert.equal(clickedItem.dataItem.foo, 'bar');
        assert.equal(clickedItem.text, 'mytext');
        assert.equal(dblClickedItem, undefined);

        this.instance._diagramInstance.onNativeAction.raise('notifyItemDblClick', this.instance._diagramInstance.model.findShapeByDataKey('123').toNative());
        assert.equal(dblClickedItem.dataItem.key, '123');
        assert.equal(dblClickedItem.dataItem.foo, 'bar');
        assert.equal(dblClickedItem.text, 'mytext');

        this.instance._diagramInstance.onNativeAction.raise('notifyItemClick', this.instance._diagramInstance.model.findConnectorByDataKey('1').toNative());
        assert.equal(clickedItem.dataItem.key, '1');
        assert.equal(clickedItem.fromKey, '123');
        assert.equal(clickedItem.toKey, '345');
    });
});

function findToolbarItem($diagram, label) {
    return $diagram.find(TOOLBAR_SELECTOR)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
