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
const RESIZE_HANDLE_RESIZABLE_CLASS = 'dx-resize-handle-resizable';
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

        this.getCollapsePrevButton = () => {
            return this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS}`);
        };

        this.getCollapseNextButton = () => {
            return this.$element.find(`.${RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS}`);
        };

        this.getResizeHandleIcon = () => {
            return this.$element.find(`.${RESIZE_HANDLE_ICON_CLASS}`);
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

    [true, false].forEach((resizable) => {
        QUnit.test(`should ${resizable ? '' : 'not'} have resizable class when resizable=${resizable}`, function(assert) {
            this.reinit({ resizable });

            assert.strictEqual(this.$element.hasClass(RESIZE_HANDLE_RESIZABLE_CLASS), resizable);
        });
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

    QUnit.module('SeparatorSize', () => {
        [
            { direction: 'horizontal', dimension: 'width', newDirection: 'vertical', newDimension: 'height' },
            { direction: 'vertical', dimension: 'height', newDirection: 'horizontal', newDimension: 'width' },
        ].forEach(({ direction, dimension, newDirection, newDimension }) => {
            QUnit.test(`Resize handle should have ${dimension}=8 by default (direction=${direction})`, function(assert) {
                this.reinit({ direction });

                assert.strictEqual(this.$element.css(dimension), '8px');
            });

            QUnit.test(`Resize handle should correctly set separator ${dimension} on init (direction=${direction})`, function(assert) {
                this.reinit({
                    direction,
                    separatorSize: 5,
                });

                assert.strictEqual(this.$element.css(dimension), '5px');
            });

            QUnit.test(`Resize handle should correctly set separator ${dimension} on init (direction=${direction})`, function(assert) {
                this.reinit({
                    direction,
                    separatorSize: 5,
                });

                assert.strictEqual(this.$element.css(dimension), '5px');
            });

            QUnit.test(`Resize handle should correctly update styles on runtime direction change (from ${direction} to ${newDirection}`, function(assert) {
                this.reinit({
                    direction,
                    separatorSize: 5,
                });

                assert.strictEqual(this.$element.css(dimension), '5px');
                assert.notStrictEqual(this.$element.css(newDimension), '5px');

                this.instance.option('direction', newDirection);

                assert.strictEqual(this.$element.css(newDimension), '5px');
                assert.notStrictEqual(this.$element.css(dimension), '5px');
            });
        });
    });

    ['vertical', 'horizontal'].forEach((direction) => {
        QUnit.test(`should have collapse prev button with correct classes (direction=${direction}) on init`, function(assert) {
            this.reinit({ direction });
            const $collapsePrevButton = $(this.$element.children()[0]);
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'left' : 'up'}`;

            assert.ok($collapsePrevButton.hasClass(RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS), 'has collapse-prev-button class');
            assert.ok($collapsePrevButton.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($collapsePrevButton.hasClass(expectedIconClass), 'has class for corresponding icon');
        });

        QUnit.test(`should have collapse next button with correct classes (direction=${direction}) on init`, function(assert) {
            this.reinit({ direction });
            const $collapseNextButton = $(this.$element.children()[2]);
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'right' : 'down'}`;

            assert.ok($collapseNextButton.hasClass(RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS), 'has collapse-next-button class');
            assert.ok($collapseNextButton.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($collapseNextButton.hasClass(expectedIconClass), 'has class for corresponding icon');
        });

        QUnit.test(`should have resize handle icon with correct class (direction=${direction}) on init`, function(assert) {
            this.reinit({ direction });
            const $resizeHandleIcon = $(this.$element.children()[1]);
            const expectedIconClass = `dx-icon-handle${direction === 'horizontal' ? 'vertical' : 'horizontal'}`;

            assert.ok($resizeHandleIcon.hasClass(RESIZE_HANDLE_ICON_CLASS));
            assert.ok($resizeHandleIcon.hasClass(ICON_CLASS), 'has dx-icon class');
            assert.ok($resizeHandleIcon.hasClass(expectedIconClass), 'has class for corresponding icon');
        });

        QUnit.test(`collapse prev button should have correct icon class on runtime direction change (initial direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $collapsePrevButton = this.getCollapsePrevButton();
            const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'left' : 'up'}`;
            const newExpectedIconClass = `dx-icon-triangle${newDirection === 'horizontal' ? 'left' : 'up'}`;

            assert.ok($collapsePrevButton.hasClass(expectedIconClass), 'has class for corresponding icon');

            this.instance.option('direction', newDirection);

            assert.notOk($collapsePrevButton.hasClass(expectedIconClass), 'has no class for old icon');
            assert.ok($collapsePrevButton.hasClass(newExpectedIconClass), 'has class for new icon');
        });

        QUnit.test(`collapse next button should have correct icon class on runtime direction change (initial direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $collapseNextButton = this.getCollapseNextButton();
            const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
            const expectedIconClass = `dx-icon-triangle${direction === 'horizontal' ? 'right' : 'down'}`;
            const newExpectedIconClass = `dx-icon-triangle${newDirection === 'horizontal' ? 'right' : 'down'}`;

            assert.ok($collapseNextButton.hasClass(expectedIconClass), 'has class for corresponding icon');

            this.instance.option('direction', newDirection);

            assert.notOk($collapseNextButton.hasClass(expectedIconClass), 'has no class for old icon');
            assert.ok($collapseNextButton.hasClass(newExpectedIconClass), 'has class for new icon');
        });

        QUnit.test(`resize handle icon should have correct class on runtime direction change (initial direction=${direction})`, function(assert) {
            this.reinit({ direction });
            const $resizeHandleIcon = this.getResizeHandleIcon();
            const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
            const expectedIconClass = `dx-icon-handle${direction === 'horizontal' ? 'vertical' : 'horizontal'}`;
            const newExpectedIconClass = `dx-icon-handle${newDirection === 'horizontal' ? 'vertical' : 'horizontal'}`;

            assert.ok($resizeHandleIcon.hasClass(expectedIconClass), 'has class for corresponding icon');

            this.instance.option('direction', newDirection);

            assert.notOk($resizeHandleIcon.hasClass(expectedIconClass), 'has no class for old icon');
            assert.ok($resizeHandleIcon.hasClass(newExpectedIconClass), 'has class for new icon');
        });
    });

    QUnit.test('collapse prev button should have state invisible class when showCollapsePrev=false', function(assert) {
        this.reinit({ showCollapsePrev: false });

        const $collapsePrevButton = this.getCollapsePrevButton();

        assert.ok($collapsePrevButton.hasClass(STATE_INVISIBLE_CLASS));
    });

    QUnit.test('collapse next button should have state invisible class when showCollapseNext=false', function(assert) {
        this.reinit({ showCollapseNext: false });

        const $collapseNextButton = this.getCollapseNextButton();

        assert.ok($collapseNextButton.hasClass(STATE_INVISIBLE_CLASS));
    });

    QUnit.test('resize handle icon should have state invisible class when resizable=false', function(assert) {
        this.reinit({ resizable: false });

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
