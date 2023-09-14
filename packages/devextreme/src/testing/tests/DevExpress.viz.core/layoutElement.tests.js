const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const layoutElementModule = require('viz/core/layout_element');

const LayoutElement = layoutElementModule.LayoutElement;
const WrapperLayoutElement = layoutElementModule.WrapperLayoutElement;

const environmentLE = {
    createLayoutElement: function(options) {
        options = $.extend({
            x: 0, y: 0, width: 10, height: 10
        },
        options);

        const layoutElement = new LayoutElement(options);
        layoutElement.shift = sinon.spy();
        layoutElement.draw = sinon.spy();
        layoutElement.getLayoutOptions = function() {
            const options = this._options;
            return {
                position: {
                    horizontal: options.horizontalAlignment,
                    vertical: options.verticalAlignment
                },
                x: options.x,
                y: options.y,
                width: options.width,
                height: options.height
            };
        };
        return layoutElement;
    }
};

const environmentW = {
    beforeEach: function() {
        const that = this;
        this.bBoxes = [];
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = function() {
            return that.bBoxes[$.inArray(this, that.renderer.g.returnValues)]
                || { x: 1, y: 3, height: 10, width: 20 };
        };
    },
    createWrapElement: function(bBox) {
        return new WrapperLayoutElement(
            this.renderer.g(),
            bBox
        );
    }
};

QUnit.module('create', environmentLE);

QUnit.test('Simple create', function(assert) {
    assert.ok(this.createLayoutElement() instanceof LayoutElement);
});

QUnit.test('Set default position', function(assert) {
    const LE1 = this.createLayoutElement();
    const LE2 = this.createLayoutElement();

    LE1.position({
        of: LE2,
        at: { horizontal: 'center', vertical: 'center' },
        my: { horizontal: 'center', vertical: 'center' }
    });

    assert.ok(LE1.shift.calledOnce);
    assert.deepEqual(LE1.shift.getCall(0).args, [0, 0]);
});

QUnit.test('Set position not empty elements', function(assert) {
    const LE1 = this.createLayoutElement({ x: 0, y: 0, width: 10, height: 10 });
    const LE2 = this.createLayoutElement({ x: 5, y: 5, width: 20, height: 20 });

    LE1.position({
        of: LE2,
        at: { horizontal: 'center', vertical: 'center' },
        my: { horizontal: 'center', vertical: 'center' }
    });

    assert.deepEqual(LE1.shift.getCall(0).args, [10, 10]);
});

QUnit.test('Set position left bottom, left bottom', function(assert) {
    const LE1 = this.createLayoutElement({ x: 5, y: 5, width: 10, height: 10 });
    const LE2 = this.createLayoutElement({ x: 5, y: 5, width: 20, height: 20 });

    LE1.position({
        of: LE2,
        at: { horizontal: 'left', vertical: 'bottom' },
        my: { horizontal: 'left', vertical: 'bottom' }
    });

    assert.deepEqual(LE1.shift.getCall(0).args, [5, 15]);
});

QUnit.test('Set position right top, right top', function(assert) {
    const LE1 = this.createLayoutElement({ x: 5, y: 5, width: 10, height: 10 });
    const LE2 = this.createLayoutElement({ x: 5, y: 5, width: 20, height: 20 });

    LE1.position({
        of: LE2,
        at: { horizontal: 'right', vertical: 'top' },
        my: { horizontal: 'right', vertical: 'top' }
    });

    assert.deepEqual(LE1.shift.getCall(0).args, [15, 5]);
});

QUnit.test('Set position right top, right top. With offset', function(assert) {
    const LE1 = this.createLayoutElement({ x: 5, y: 5, width: 10, height: 10 });
    const LE2 = this.createLayoutElement({ x: 5, y: 5, width: 20, height: 20 });

    LE1.position({
        of: LE2,
        at: { horizontal: 'right', vertical: 'top' },
        my: { horizontal: 'right', vertical: 'top' },
        offset: {
            horizontal: 10,
            vertical: 10
        }
    });

    assert.deepEqual(LE1.shift.getCall(0).args, [25, 15]);
});

QUnit.test('Set position. Round coord', function(assert) {
    const LE1 = this.createLayoutElement({ x: 5, y: 5, width: 11, height: 11 });
    const LE2 = this.createLayoutElement({ x: 5, y: 5, width: 20, height: 20 });

    LE1.position({
        of: LE2,
        at: { horizontal: 'center', vertical: 'center' },
        my: { horizontal: 'center', vertical: 'center' }
    });

    assert.deepEqual(LE1.shift.getCall(0).args, [10, 10]);
});

QUnit.module('Get BBox', environmentLE);

QUnit.test('simple getLayoutOptions', function(assert) {
    const LE = this.createLayoutElement({ x: 11, y: 23, width: 99, height: 10, verticalAlignment: 'bottom', horizontalAlignment: 'right' });

    assert.deepEqual(LE.getLayoutOptions(), { x: 11, y: 23, width: 99, height: 10, position: { vertical: 'bottom', horizontal: 'right' } });
});

QUnit.module('Wrapper render element', environmentW);

QUnit.test('wrap render element', function(assert) {
    assert.ok(this.createWrapElement(this.renderer.g()) instanceof WrapperLayoutElement);
});

QUnit.test('position. Equal elements', function(assert) {
    this.createWrapElement().position({
        of: this.createWrapElement(),
        at: { horizontal: 'center', vertical: 'center' },
        my: { horizontal: 'center', vertical: 'center' }
    });

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [0, 0]);
});

QUnit.test('position. Diff elements', function(assert) {
    this.bBoxes = [{ x: -1, y: 3, width: 14, height: 16 },
        { x: 3, y: 11, width: 16, height: 18 }];

    this.createWrapElement().position({
        of: this.createWrapElement(),
        at: { horizontal: 'center', vertical: 'center' },
        my: { horizontal: 'center', vertical: 'center' }
    });

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [5, 9]);
});

QUnit.test('position. Cache  bbox elements', function(assert) {
    this.createWrapElement({ x: -1, y: 3, width: 14, height: 16 }).
        position({
            of: this.createWrapElement({ x: 3, y: 11, width: 16, height: 18 }),
            at: { horizontal: 'center', vertical: 'center' },
            my: { horizontal: 'center', vertical: 'center' }
        });
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [5, 9]);
});

QUnit.test('position. Transform must be rounded', function(assert) {
    this.createWrapElement({ x: -1, y: 3, width: 13, height: 15 }).
        position({
            of: this.createWrapElement({ x: 3, y: 11, width: 16, height: 18 }),
            at: { horizontal: 'center', vertical: 'center' },
            my: { horizontal: 'center', vertical: 'center' }
        });
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [6, 10]);
});
