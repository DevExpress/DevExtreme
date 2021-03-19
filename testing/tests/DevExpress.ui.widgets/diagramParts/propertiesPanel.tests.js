import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { DiagramCommand } from 'devexpress-diagram';
import { Consts, getPropertiesToolbarElement, getPropertiesToolbarInstance, findPropertiesToolbarItem, findPropertiesPanelToolbarItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Properties Panel', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should render if propertiesPanel.visibility is "visible"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 1);
        const $toolbar = getPropertiesToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);
    });
    test('should not render if propertiesPanel.visibility is "disabled"', function(assert) {
        let $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 3);
        this.instance.option('propertiesPanel.visibility', 'disabled');
        const $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 0);
        $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 2);
    });
    test('should render if propertiesPanel.visibility is "collapsed"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'collapsed');
        let $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 0);
        const $toolbar = getPropertiesToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);

        let $button = findPropertiesToolbarItem(this.$element, 'properties');
        $button.trigger('dxclick');
        $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 1);
        assert.equal($panel.is(':visible'), true);

        $button = findPropertiesToolbarItem(this.$element, 'properties');
        $button.trigger('dxclick');
        this.clock.tick(2000);
        assert.equal($panel.length, 1);
        assert.equal($panel.is(':visible'), false);
    });
    test('should fill properties panel with default items', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = getPropertiesToolbarInstance(this.$element);
        assert.equal(toolbar.option('items').length, 1);
    });
    test('should fill properties panel with custom items', function(assert) {
        this.instance.option('propertiesPanel.tabs', [{ commands: ['units'] }]);
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = getPropertiesToolbarInstance(this.$element);
        assert.equal(toolbar.option('items').length, 1);
    });
    test('button should raise diagram commands', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        assert.notOk(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
        findPropertiesPanelToolbarItem(this.$element, 'left').trigger('dxclick');
        assert.ok(this.instance._diagramInstance.commandManager.getCommand(DiagramCommand.TextLeftAlign).getState().value);
    });
    test('diagram should be focused after set font bold', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const $boldButton = findPropertiesPanelToolbarItem(this.$element, 'bold');
        assert.notEqual(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
        $boldButton.trigger('dxclick');
        this.clock.tick(200);
        assert.equal(document.activeElement, this.instance._diagramInstance.render.input.inputElement);
    });
});
