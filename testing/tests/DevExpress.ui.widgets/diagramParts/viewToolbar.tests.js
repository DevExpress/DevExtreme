import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

import { Consts, findViewToolbarItem } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('View Toolbar', {
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
        assert.equal($toolbar.length, 2);
        this.instance.option('viewToolbar.visible', false);
        $toolbar = this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR);
        assert.equal($toolbar.length, 1);
    });
    test('should fill toolbar with default items', function(assert) {
        const toolbar = $(this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(1)).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 6);
    });
    test('should fill toolbar with custom items', function(assert) {
        this.instance.option('viewToolbar.commands', ['copy']);
        const toolbar = $(this.$element.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(1)).dxToolbar('instance');
        assert.equal(toolbar.option('dataSource').length, 1); // + show properties panel
    });
    test('should toggle fullscreen class name on button click', function(assert) {
        assert.notOk(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
        const fullScreenButton = findViewToolbarItem(this.$element, 'full screen');
        fullScreenButton.trigger('dxclick');
        assert.ok(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
        fullScreenButton.trigger('dxclick');
        assert.notOk(this.$element.hasClass(Consts.FULLSCREEN_CLASS));
    });
});
