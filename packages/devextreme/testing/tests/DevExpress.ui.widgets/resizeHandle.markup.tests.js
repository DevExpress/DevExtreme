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
const RESIZE_HANDLE_ICON_CLASS = 'dx-resize-handle-icon';
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = 'dx-resize-handle-collapse-prev-pane';
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = 'dx-resize-handle-collapse-next-pane';
const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const ICON_CLASS = 'dx-icon';

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

    ['vertical', 'horizontal'].forEach((direction) => {
        QUnit.test(`should have collapse prev button with correct classes (direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $collapsePrevButton = $(this.$element.children()[0]);
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'left' : 'up'}`;

            assert.ok($collapsePrevButton.hasClass(RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS), 'has collapse-prev-button class');
            assert.ok($collapsePrevButton.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($collapsePrevButton.hasClass(expectedIconClass), 'has class for corresponding icon');
        });

        QUnit.test(`should have collapse next button with correct classes (direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $collapseNextButton = $(this.$element.children()[2]);
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'right' : 'down'}`;

            assert.ok($collapseNextButton.hasClass(RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS), 'has collapse-next-button class');
            assert.ok($collapseNextButton.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($collapseNextButton.hasClass(expectedIconClass), 'has class for corresponding icon');
        });

        QUnit.test(`should have resize handle icon with correct class (direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $resizeHandleIcon = $(this.$element.children()[1]);
            const expectedIconClass = `dx-icon-handle${direction === 'horizontal' ? 'vertical' : 'horizontal'}`;
    
            assert.ok($resizeHandleIcon.hasClass(RESIZE_HANDLE_ICON_CLASS));
            assert.ok($resizeHandleIcon.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($resizeHandleIcon.hasClass(expectedIconClass), 'has class for corresponding icon');
        });
    });

    QUnit.test('collapse prev button should have state invisible class when showCollapsePrev=false', function(assert) {
        this.reinit({ showCollapsePrev: false });

        const $collapsePrevButton = $(this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`));

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS));
    });

    QUnit.test('collapse next button should have state invisible class when showCollapseNext=false', function(assert) {
        this.reinit({ showCollapseNext: false });

        const $collapseNextButton = $(this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`));

        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS));
    });

    QUnit.test('resize handle icon should have state invisible class when resizable=false', function(assert) {
        this.reinit({ showResizableIcon: false });

        const $resizeHandleIcon = $(this.$element.find(`.${RESIZE_HANDLE_ICON_CLASS}`));

        assert.ok($resizeHandleIcon.hasClass(STATE_INVISIBLE_CLASS));
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
