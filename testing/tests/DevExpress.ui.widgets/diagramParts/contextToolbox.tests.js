import $ from 'jquery';
const { test } = QUnit;
import 'ui/diagram';

import { Consts } from '../../../helpers/diagramHelpers.js';

const moduleConfig = {
    beforeEach: function() {
        this.onCustomCommand = sinon.spy();
        this.$element = $('#diagram').dxDiagram({
            onCustomCommand: this.onCustomCommand
        });
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('Context Toolbox', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should not render if contextToolbox.enabled is false', function(assert) {
        let $contextToolbox = this.$element.find(Consts.CONTEXT_TOOLBOX_SELECTOR);
        assert.equal($contextToolbox.length, 1);
        this.instance.option('contextToolbox.enabled', false);
        $contextToolbox = this.$element.find(Consts.CONTEXT_TOOLBOX_SELECTOR);
        assert.equal($contextToolbox.length, 0);
    });
    test('should set contextToolbox width', function(assert) {
        let $contextToolbox = $('body').find(Consts.CONTEXT_TOOLBOX_CONTENT_SELECTOR);
        assert.equal($contextToolbox.length, 0);
        this.instance._contextToolbox._show(0, 0, 0, 'general', () => {});
        $contextToolbox = $('body').find(Consts.CONTEXT_TOOLBOX_CONTENT_SELECTOR);
        assert.equal($contextToolbox.length, 1);
        assert.notEqual($contextToolbox.width(), 300);
        this.instance.option('contextToolbox.width', 300);
        this.instance._contextToolbox._show(0, 0, 0, 'general', () => {});
        $contextToolbox = $('body').find(Consts.CONTEXT_TOOLBOX_CONTENT_SELECTOR);
        assert.equal($contextToolbox.length, 1);
        assert.equal($contextToolbox.width(), 300);
    });
});
