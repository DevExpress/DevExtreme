import dxChart from 'viz/chart';
import dxPieChart from 'viz/pie_chart';
import dxPolarChart from 'viz/polar_chart';

QUnit.module('Charts', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

const dataSource = [{ arg: 'a', val: 1 }, { arg: 'b', val: 2 }];

[
    ['dxChart', dxChart],
    ['dxPieChart', dxPieChart],
    ['dxPolarChart', dxPolarChart]
].forEach(function([name, Widget]) {
    QUnit.test(`${name}: only the sized element is rendered when sizes are defined`, function(assert) {
        this.instance = new Widget(this.element, { width: 400, height: 250, dataSource });

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '400px');
        assert.strictEqual(this.element.childNodes[0].style.height, '250px');
    });

    QUnit.test(`${name}: the sized element takes the default size when sizes are not defined`, function(assert) {
        this.instance = new Widget(this.element, { dataSource });

        assert.strictEqual(this.element.childNodes.length, 1, 'one child');
        assert.strictEqual(this.element.childNodes[0].style.width, '100%');
        assert.strictEqual(this.element.childNodes[0].style.height, '400px');
    });

    QUnit.test(`${name}: public methods do nothing, options still work`, function(assert) {
        this.instance = new Widget(this.element, { dataSource });

        ['getAllSeries', 'clearSelection', 'hideTooltip', 'render'].forEach((method) => {
            assert.strictEqual(this.instance[method](), undefined, `${method} is inert`);
        });

        this.instance.option('palette', 'Soft');
        assert.strictEqual(this.instance.option('palette'), 'Soft', 'option is kept');
        assert.strictEqual(this.instance.element(), this.element, 'element is kept');
    });
});
