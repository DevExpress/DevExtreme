import $ from 'jquery';

import 'ui/splitter';

import fx from 'animation/fx';
import ResizeHandle from '__internal/ui/splitter/resize_handle';

QUnit.testStart(function() {
    const markup =
        '<div id="resizeHandle"></div>';

    $('#qunit-fixture').html(markup);
});

const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;

        const init = (options = {}) => {
            this.instance = new ResizeHandle($('#resizeHandle'), options);
            this.$element = this.instance.$element();
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('ResizeHandle markup', moduleConfig, () => {
    QUnit.test('should have correct root class', function(assert) {
        assert.strictEqual(this.$element.hasClass(RESIZE_HANDLE_CLASS), true);
    });

    QUnit.test('should be initialized with horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), true);
    });

    QUnit.test('direction should be initialized correctly', function(assert) {
        this.reinit({ direction: 'vertical' });

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), true);
    });

    QUnit.test('direction should be changed at runtime', function(assert) {
        this.instance.option('direction', 'vertical');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), true);

        this.instance.option('direction', 'horizontal');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_DIRECTION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(VERTICAL_DIRECTION_CLASS), false);
    });
});

QUnit.module('Aria attributes', moduleConfig, () => {
    QUnit.test('aria-label attribute should be set correctly', function(assert) {
        this.reinit({ });

        assert.strictEqual(this.$element.attr('aria-label'), 'Split bar');
    });

    ['horizontal', 'vertical'].forEach((direction) => {
        QUnit.test('aria-orientation attribute should be set correctly', function(assert) {
            this.reinit({ direction });

            const expectedOrientationAttrValue = direction === 'horizontal' ? 'vertical' : 'horizontal';

            assert.strictEqual(this.$element.attr('aria-orientation'), expectedOrientationAttrValue);
        });
    });

    QUnit.test('role attribute should be set correctly', function(assert) {
        this.reinit({ });

        assert.strictEqual(this.$element.attr('role'), 'application');
    });

    QUnit.test('aria-roledescription attribute should be set correctly', function(assert) {
        this.reinit({ });

        assert.strictEqual(this.$element.attr('aria-roledescription'), 'separator');
    });
});
