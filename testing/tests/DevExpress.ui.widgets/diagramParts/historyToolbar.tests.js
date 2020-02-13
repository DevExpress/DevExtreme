import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

const FLOATING_TOOLBAR_SELECTOR = '.dx-diagram-floating-toolbar-container > .dx-diagram-toolbar';

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
        let $toolbar = this.$element.find(FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 2);
        this.instance.option('historyToolbar.visible', false);
        $toolbar = this.$element.find(FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 1);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = $(this.$element.find(FLOATING_TOOLBAR_SELECTOR).get(0)).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 3);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('historyToolbar.commands', ['copy']);
        const toolbar = $(this.$element.find(FLOATING_TOOLBAR_SELECTOR).get(0)).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1); // + show properties panel
    });
});
