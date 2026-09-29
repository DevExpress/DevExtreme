import dxFunnel from 'viz/funnel';

QUnit.module('Funnel', {
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
    this.instance = new dxFunnel(this.element, { width: 400, height: 250, dataSource: [{ value: 1 }, { value: 2 }] });

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '400px');
    assert.strictEqual(this.element.childNodes[0].style.height, '250px');
});

QUnit.test('the sized element takes the default size when sizes are not defined', function(assert) {
    this.instance = new dxFunnel(this.element, { dataSource: [{ value: 1 }, { value: 2 }] });

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '100%');
    assert.strictEqual(this.element.childNodes[0].style.height, '400px');
});

QUnit.test('public methods do nothing, options still work', function(assert) {
    this.instance = new dxFunnel(this.element, { dataSource: [{ value: 1 }] });

    ['getAllItems', 'clearHover', 'clearSelection', 'hideTooltip'].forEach((method) => {
        assert.strictEqual(this.instance[method](), undefined, `${method} is inert`);
    });

    this.instance.option('neckWidth', 0.3);
    assert.strictEqual(this.instance.option('neckWidth'), 0.3, 'option is kept');
    assert.strictEqual(this.instance.element(), this.element, 'element is kept');
});
