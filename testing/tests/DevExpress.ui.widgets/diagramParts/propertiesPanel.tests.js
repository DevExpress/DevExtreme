import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { Consts } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Properties Panel', moduleConfig, () => {
    test('should render if propertiesPanel.visibility is "visible"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const $accordion = $('body').find(Consts.PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 1);
    });
    test('should not render if propertiesPanel.visibility is "disabled"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'disabled');
        const $accordion = $('body').find(Consts.PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should render if propertiesPanel.visibility is "collapsed"', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'collapsed');
        let $accordion = $('body').find(Consts.PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
        const $button = $('body').find(Consts.PROPERTIES_PANEL_BTN_SELECTOR);
        $button.find('.dx-fa-button-icon').trigger('dxclick');
        $accordion = $('body').find(Consts.PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), true);
        $button.find('.dx-fa-button-icon').trigger('dxclick');
        assert.equal($accordion.length, 1);
        assert.equal($accordion.is(':visible'), false);
    });
    test('should fill properties panel with default items', function(assert) {
        this.instance.option('propertiesPanel.visibility', 'visible');
        const form = $('body').find(Consts.PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.ok(form.option('items').length > 1);
    });
    test('should fill toolbox with custom items', function(assert) {
        this.instance.option('propertiesPanel.groups', [{ commands: ['units'] }]);
        this.instance.option('propertiesPanel.visibility', 'visible');
        const form = $('body').find(Consts.PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.equal(form.option('items').length, 1);
    });
});
