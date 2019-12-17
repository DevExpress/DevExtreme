import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import translator2DModule from 'viz/translators/translator2d';
import rangeViewModule from 'viz/range_selector/range_view';
import { MockAxis } from '../../helpers/chartMocks.js';

QUnit.module('RangeView', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.root = new vizMocks.Element();
        this.translator = { tag: 'translator' };
        this.rangeView = new rangeViewModule.RangeView({
            renderer: this.renderer,
            root: this.root,
            translator: this.translator
        });
        this.canvas = { left: 10, top: 20, width: 200, height: 100 };
    }
});

QUnit.test('Clip rect', function(assert) {
    assert.deepEqual(this.renderer.clipRect.lastCall.args, [], 'created');
    assert.deepEqual(this.root.attr.lastCall.args, [{ 'clip-path': this.renderer.clipRect.lastCall.returnValue.id }], 'applied to root');
});

QUnit.test('Rect and image are created', function(assert) {
    this.rangeView.update({ color: 'red', image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas);

    assert.deepEqual(this.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(this.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 10, y: 20, width: 190, height: 100 }], 'clip rect');
    assert.deepEqual(this.renderer.rect.lastCall.args, [10, 20, 191, 100], 'rect is created');
    assert.deepEqual(this.renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ 'class': 'dx-range-selector-background', fill: 'red' }], 'rect settings');
    assert.deepEqual(this.renderer.rect.lastCall.returnValue.append.lastCall.args, [this.root], 'rect is appended');
    assert.deepEqual(this.renderer.image.lastCall.args, [10, 20, 191, 100, 'url', 'loc'], 'image is created');
    assert.deepEqual(this.renderer.image.lastCall.returnValue.append.lastCall.args, [this.root], 'image is appended');
});

QUnit.test('Rect is not created because of \'color\' option', function(assert) {
    this.rangeView.update({ image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas);

    assert.strictEqual(this.renderer.stub('rect').lastCall, null);
});

QUnit.test('Image is not created because of \'url\' option', function(assert) {
    this.rangeView.update({ color: 'red' }, { visible: true, image: { location: 'loc' } }, this.canvas);

    assert.strictEqual(this.renderer.stub('image').lastCall, null);
});

QUnit.test('Rect and image are not created because of \'visible\' option', function(assert) {
    this.rangeView.update({ visible: false, color: 'red', image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas);

    assert.strictEqual(this.renderer.stub('rect').lastCall, null);
    assert.strictEqual(this.renderer.stub('image').lastCall, null);
});

QUnit.test('Chart view', function(assert) {
    var valueAxis = new MockAxis({ renderer: this.renderer }),
        series = [{
            _extGroups: {},
            draw: sinon.spy(),
            getValueAxis: function() {
                return valueAxis;
            }
        }, {
            _extGroups: {},
            draw: sinon.spy()
        }],
        range = { val: { range: 'bound-range', sortCategories: sinon.spy() } },
        seriesDataSource = {
            isShowChart: function() { return true; },
            getSeries: function() { return series; },
            getBoundRange: function() { return range; },
            adjustSeriesDimensions: sinon.spy()
        },
        root = this.root;
    valueAxis.updateOptions({ categoriesSortingMethod: 'some sorter method' });

    this.rangeView.update({ color: 'red', image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas, false, 'animation-enabled', seriesDataSource);

    assert.deepEqual(valueAxis.updateCanvas.lastCall.args[0], {
        top: this.canvas.top,
        bottom: 0,
        height: this.canvas.height + this.canvas.top
    });

    assert.ok(seriesDataSource.adjustSeriesDimensions.called, 'series dimensions');
    assert.ok(seriesDataSource.adjustSeriesDimensions.lastCall.calledAfter(valueAxis.updateCanvas.lastCall));

    assert.deepEqual(range.val.sortCategories.lastCall.args, ['some sorter method']);
    assert.strictEqual(valueAxis.setBusinessRange.lastCall.args[0], range.val);

    $.each(series, function(i, item) {
        assert.strictEqual(item._extGroups.seriesGroup, root.children[2], 'series group - ' + i);
        assert.strictEqual(item._extGroups.labelsGroup, root.children[2], 'labels group - ' + i);
        assert.deepEqual(item.draw.lastCall.args, ['animation-enabled'], 'series draw - ' + i);
    });
});

QUnit.test('Chart view is not created because of seriesDataSource', function(assert) {
    var seriesDataSource = { isShowChart: function() { return false; } },
        Translator2D = sinon.spy(translator2DModule, 'Translator2D');

    try {
        this.rangeView.update({ color: 'red', image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas, false, 'animation-enabled', seriesDataSource, 'translator');

        assert.strictEqual(Translator2D.lastCall, null);
    } finally {
        Translator2D.restore();
    }
});

QUnit.test('Nothing is created when mode is compact', function(assert) {
    this.rangeView.update({ color: 'red', image: { url: 'url' } }, { visible: true, image: { location: 'loc' } }, this.canvas, true);

    assert.deepEqual(this.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(this.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 10, y: 20, width: 190, height: 100 }], 'clip rect');
    assert.strictEqual(this.renderer.stub('rect').lastCall, null);
    assert.strictEqual(this.renderer.stub('image').lastCall, null);
});
