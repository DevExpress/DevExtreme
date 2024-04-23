const domAdapter = require('core/dom_adapter');

QUnit.module('DOM Adapter', {
    beforeEach: function() {
        const fixture = document.getElementById('qunit-fixture');
        this.container = document.createElement('div');
        fixture.appendChild(this.container);
    }
});

QUnit.test('insertElement', function(assert) {
    const target = document.createElement('span');

    domAdapter.insertElement(this.container, target);

    assert.equal(this.container.childNodes.length, 1);
});

QUnit.test('listen with no window', function(assert) {
    assert.expect(0);

    const windowObject = {};
    windowObject.window = windowObject;

    domAdapter.listen(windowObject, 'test-event', function() {});
});

QUnit.module('DOM Adapter injection', {
    afterEach: function() {
        domAdapter.resetInjection();
    }
});

QUnit.test('inject document', function(assert) {
    const doc = {};
    domAdapter.inject({
        _document: doc
    });
    assert.equal(domAdapter.getDocument(), doc);
});

QUnit.test('isNode should ignore objects with nodeType field (T962165)', function(assert) {
    assert.notOk(domAdapter.isNode({ nodeType: 'nodeType' }));
});
