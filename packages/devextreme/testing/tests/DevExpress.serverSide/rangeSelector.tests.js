import dxRangeSelector from 'viz/range_selector';

QUnit.module('RangeSelector', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

QUnit.test('only the sized element is rendered when sizes are defined', function(assert) {
    this.instance = new dxRangeSelector(this.element, { width: 500, height: 200 });

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '500px');
    assert.strictEqual(this.element.childNodes[0].style.height, '200px');
});

QUnit.test('the sized element takes the default size when sizes are not defined', function(assert) {
    this.instance = new dxRangeSelector(this.element, {});

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '100%');
    assert.strictEqual(this.element.childNodes[0].style.height, '160px');
});

QUnit.test('public methods do nothing, options still work', function(assert) {
    this.instance = new dxRangeSelector(this.element, {});

    assert.strictEqual(this.instance.getValue(), undefined, 'getValue is inert');
    assert.strictEqual(this.instance.setValue([1, 2]), undefined, 'setValue is inert');

    this.instance.option('dataSourceField', 'arg');
    assert.strictEqual(this.instance.option('dataSourceField'), 'arg', 'option is kept');
    assert.strictEqual(this.instance.element(), this.element, 'element is kept');
});
