import dxBarGauge from 'viz/bar_gauge';
import dxCircularGauge from 'viz/circular_gauge';
import dxLinearGauge from 'viz/linear_gauge';

QUnit.module('Gauges', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

[
    ['dxCircularGauge', dxCircularGauge, 300, ['value', 'subvalues']],
    ['dxLinearGauge', dxLinearGauge, 100, ['value', 'subvalues']],
    ['dxBarGauge', dxBarGauge, 300, ['values']]
].forEach(function([name, Widget, defaultHeight, publicMethods]) {
    QUnit.test(`${name}: only the sized element is rendered when sizes are defined`, function(assert) {
        this.instance = new Widget(this.element, { width: 400, height: 250, value: 10, values: [1, 2] });

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '400px');
        assert.strictEqual(this.element.childNodes[0].style.height, '250px');
    });

    QUnit.test(`${name}: the sized element takes the default size when sizes are not defined`, function(assert) {
        this.instance = new Widget(this.element, { value: 10, values: [1, 2] });

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '100%');
        assert.strictEqual(this.element.childNodes[0].style.height, `${defaultHeight}px`);
    });

    QUnit.test(`${name}: public methods do nothing, options still work`, function(assert) {
        this.instance = new Widget(this.element, {});

        publicMethods.forEach((method) => {
            assert.strictEqual(this.instance[method]([1, 2]), undefined, `${method} setter is inert`);
            assert.strictEqual(this.instance[method](), undefined, `${method} getter is inert`);
        });

        this.instance.option('value', 42);
        assert.strictEqual(this.instance.option('value'), 42, 'option is kept');
        assert.strictEqual(this.instance.element(), this.element, 'element is kept');
    });
});
