import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { Consts, getPropertiesPanelToolbarElement, findPropertiesPanelToolbarItem } from '../../../helpers/diagramHelpers.js';

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
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);
    });
    test('should not render if propertiesPanel.visibility is "disabled"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'disabled');
        const $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 0);
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 0);
    });
    test('should render if propertiesPanel.visibility is "collapsed"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'collapsed');
        let $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 0);
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);

        let $button = findPropertiesPanelToolbarItem(this.$element, 'properties');
        $button.trigger('dxclick');
        $panel = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($panel.length, 1);
        assert.equal($panel.is(':visible'), true);

        $button = findPropertiesPanelToolbarItem(this.$element, 'properties');
        $button.trigger('dxclick');
        this.clock.tick(2000);
        assert.equal($panel.length, 1);
        assert.equal($panel.is(':visible'), false);
    });
    test('should fill properties panel with default items', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = $('body').find(Consts.PROPERTIES_PANEL_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.ok(toolbar.option('items').length > 1);
    });
    test('should fill properties panel with custom items', function(assert) {
        this.instance.option('propertiesPanel.tabs', [{ commands: ['units'] }]);
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = $('body').find(Consts.PROPERTIES_PANEL_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('items').length, 1);
    });
});
