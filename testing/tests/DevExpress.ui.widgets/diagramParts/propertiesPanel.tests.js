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
    test('should not render if propertiesPanel.enabled is false', function(assert) {
        this.instance.option('propertiesPanel.enabled', false);
        const $accordion = this.$element.find(Consts.PROPERTIES_PANEL_ACCORDION_SELECTOR);
        assert.equal($accordion.length, 0);
    });
    test('should fill properties panel with default items', function(assert) {
        const form = this.$element.find(Consts.PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.ok(form.option('items').length > 1);
    });
    test('should fill toolbox with custom items', function(assert) {
        this.instance.option('propertiesPanel.groups', [{ commands: ['units'] }]);
        const form = this.$element.find(Consts.PROPERTIES_PANEL_FORM_SELECTOR).dxForm('instance');
        assert.equal(form.option('items').length, 1);
    });
});
