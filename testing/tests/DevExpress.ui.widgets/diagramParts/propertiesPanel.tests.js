import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { Consts, findToolbarItem } from '../../../helpers/diagramHelpers.js';

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
        const optionsButton = findToolbarItem(this.$element, 'properties');
        optionsButton.trigger('dxclick');
        $accordion = $('body').find(Consts.TOOLBOX_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 1);
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
