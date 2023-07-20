import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { Consts, getHistoryToolbarInstance } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('History Toolbar', {
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
        let $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 3);
        this.instance.option('historyToolbar.visible', false);
        $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 2);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = getHistoryToolbarInstance(this.$element);
        assert.equal(toolbar.option('dataSource').length, this.instance.isMobileScreenSize() ? 4 : 2);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('historyToolbar.commands', ['copy']);
        const toolbar = getHistoryToolbarInstance(this.$element);
        assert.equal(toolbar.option('dataSource').length, 1);
    });
});
