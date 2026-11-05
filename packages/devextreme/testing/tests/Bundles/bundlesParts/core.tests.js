import $ from 'jquery';

QUnit.test('core', function(assert) {

    $.each([
        'hideTopOverlay',
        'devices',
        'registerComponent'
    ], function(_, namespace) {
        assert.ok(DevExpress[namespace], 'DevExpress.' + namespace + ' present');
    });

});

QUnit.test('DevExpress.Class.inherit: ctor and callBase', function(assert) {
    const Base = DevExpress.Class.inherit({
        ctor: function(value) {
            this.value = value;
        },
        describe: function() {
            return 'base ' + this.value;
        }
    });
    const Derived = Base.inherit({
        describe: function() {
            return 'derived, ' + this.callBase();
        }
    });

    const instance = new Derived(1);

    assert.ok(instance instanceof Base);
    assert.strictEqual(instance.describe(), 'derived, base 1');
});

QUnit.test('DevExpress.DOMComponent.inherit creates a working component', function(assert) {
    const Dummy = DevExpress.DOMComponent.inherit({
        _useTemplates: function() {
            return false;
        }
    });
    const element = document.createElement('div');

    const instance = new Dummy(element, { width: 100 });

    assert.strictEqual($(instance.element()).get(0), element);
    assert.strictEqual(instance.option('width'), 100);
    assert.strictEqual(element.style.width, '100px');

    instance.dispose();
});
