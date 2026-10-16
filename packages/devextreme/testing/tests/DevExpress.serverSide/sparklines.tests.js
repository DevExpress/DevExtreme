import dxBullet from 'viz/bullet';
import dxSparkline from 'viz/sparkline';

QUnit.module('Sparklines', {
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
    ['dxSparkline', dxSparkline, 30, { dataSource: [1, 2, 3] }],
    ['dxBullet', dxBullet, 30, { value: 5, target: 3 }]
].forEach(function([name, Widget, defaultHeight, options]) {
    QUnit.test(`${name}: only the sized element is rendered when sizes are defined`, function(assert) {
        this.instance = new Widget(this.element, Object.assign({ width: 400, height: 50 }, options));

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '400px');
        assert.strictEqual(this.element.childNodes[0].style.height, '50px');
    });

    QUnit.test(`${name}: the sized element takes the default size when sizes are not defined`, function(assert) {
        this.instance = new Widget(this.element, options);

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '100%');
        assert.strictEqual(this.element.childNodes[0].style.height, `${defaultHeight}px`);
    });

    QUnit.test(`${name}: options still work`, function(assert) {
        this.instance = new Widget(this.element, {});

        this.instance.option('value', 42);
        assert.strictEqual(this.instance.option('value'), 42, 'option is kept');
        assert.strictEqual(this.instance.element(), this.element, 'element is kept');
    });
});

QUnit.test('dxSparkline: public methods do nothing', function(assert) {
    this.instance = new dxSparkline(this.element, { dataSource: [1, 2, 3] });

    assert.strictEqual(this.instance.getSeriesOptions(), undefined, 'getSeriesOptions is inert');
});
