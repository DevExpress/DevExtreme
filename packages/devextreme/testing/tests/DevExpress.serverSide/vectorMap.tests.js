import dxVectorMap from 'viz/vector_map';

QUnit.module('VectorMap', {
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
    this.instance = new dxVectorMap(this.element, { width: 400, height: 250 });

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '400px');
    assert.strictEqual(this.element.childNodes[0].style.height, '250px');
});

QUnit.test('the sized element takes the default size when sizes are not defined', function(assert) {
    this.instance = new dxVectorMap(this.element, {});

    assert.strictEqual(this.element.childNodes.length, 1, 'one child');
    assert.strictEqual(this.element.childNodes[0].style.width, '100%');
    assert.strictEqual(this.element.childNodes[0].style.height, '400px');
});

QUnit.test('public methods do nothing, options still work', function(assert) {
    this.instance = new dxVectorMap(this.element, {});

    ['getLayers', 'clearSelection', 'center', 'zoomFactor', 'viewport'].forEach((method) => {
        assert.strictEqual(this.instance[method](), undefined, `${method} is inert`);
    });

    this.instance.option('zoomFactor', 2);
    assert.strictEqual(this.instance.option('zoomFactor'), 2, 'option is kept');
    assert.strictEqual(this.instance.element(), this.element, 'element is kept');
});
