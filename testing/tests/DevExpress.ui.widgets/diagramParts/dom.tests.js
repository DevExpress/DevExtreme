import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/diagram';

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#diagram').dxDiagram();
        this.instance = this.$element.dxDiagram('instance');
    }
};

QUnit.module('DOM Layout', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();
    }
}, () => {
    test('should return correct size of document container in default options', function(assert) {
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });
    test('should return correct size of document container if options panel is hidden', function(assert) {
        this.instance.option('propertiesPanel.enabled', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if toolbox is hidden', function(assert) {
        this.instance.option('toolbox.visible', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if toolbar is hidden', function(assert) {
        this.instance.option('toolbar.visible', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });

    test('should return correct size of document container if all UI is hidden', function(assert) {
        this.instance.option('toolbar.visible', false);
        this.instance.option('toolbox.visible', false);
        this.instance.option('propertiesPanel.enabled', false);
        this.clock.tick(10000);
        assertSizes(assert,
            this.$element.find('.dxdi-control'),
            this.$element.find('.dx-diagram-drawer-wrapper'),
            this.instance);
    });


    function assertSizes(assert, $scrollContainer, $actualContainer, inst) {
        assert.equal($scrollContainer.width(), $actualContainer.width());
        assert.equal($scrollContainer.height(), $actualContainer.height());
        const coreScrollSize = inst._diagramInstance.render.view.scrollView.getSize();
        assert.equal(coreScrollSize.width, $actualContainer.width());
        assert.equal(coreScrollSize.height, $actualContainer.height());
    }
});
