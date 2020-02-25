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

QUnit.module('Properties Panel', moduleConfig, () => {
    test('should render if propertiesPanel.visibility is "visible"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const $accordion = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($accordion.length, 1);
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);
    });
    test('should not render if propertiesPanel.visibility is "disabled"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'disabled');
        const $accordion = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($accordion.length, 0);
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 0);
    });
    test('should render if propertiesPanel.visibility is "collapsed"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'collapsed');
        let $accordion = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($accordion.length, 0);
        const $toolbar = getPropertiesPanelToolbarElement(this.$element);
        assert.equal($toolbar.length, 1);

        const $button = findPropertiesPanelToolbarItem(this.$element, 'properties');
        $button.trigger('dxclick');
        $accordion = $('body').find(Consts.PROPERTIES_PANEL_SELECTOR);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), true);

        $button.trigger('dxclick');
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), false);
    });
    test('should fill properties panel with default items', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = $('body').find(Consts.PROPERTIES_PANEL_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.ok(toolbar.option('items').length > 1);
    });
    test('should fill properties panel with custom items', function(assert) {
        this.instance.option('propertiesPanel.groups', [{ commands: ['units'] }]);
        this.instance.option('propertiesPanel.visibility', 'visible');
        const toolbar = $('body').find(Consts.PROPERTIES_PANEL_TOOLBAR_SELECTOR).dxToolbar('instance');
        assert.equal(toolbar.option('items').length, 1);
    });
});
