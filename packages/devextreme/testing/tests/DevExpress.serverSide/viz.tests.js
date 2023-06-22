const BaseVizWidget = require('__internal/viz/core/m_base_widget').default;

QUnit.module('Viz', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

QUnit.test('Sized element when sizes are defined', function(assert) {
    const TestVizBaseVizWidget = BaseVizWidget.inherit({});

    this.instance = new TestVizBaseVizWidget(this.element, {
        width: 500,
        height: 500
    });

    assert.equal(this.element.childNodes[0].style.width, '500px');
    assert.equal(this.element.childNodes[0].style.height, '500px');
});

QUnit.test('Sized element when sizes are not defined', function(assert) {
    const TestVizBaseVizWidget = BaseVizWidget.inherit({
        _getDefaultSize: function() {
            return { width: 200, height: 200 };
        }
    });

    this.instance = new TestVizBaseVizWidget(this.element);

    assert.equal(this.element.childNodes[0].style.width, '100%');
    assert.equal(this.element.childNodes[0].style.height, '200px');
});

QUnit.test('element method should return correct value', function(assert) {
    const TestVizBaseVizWidget = BaseVizWidget.inherit({
        _getDefaultSize: function() {
            return { width: 200, height: 200 };
        }
    });

    this.instance = new TestVizBaseVizWidget(this.element);

    assert.equal(this.instance.element(), this.element);
});
