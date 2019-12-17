import $ from 'jquery';
import Lookup from 'ui/lookup';
import { Deferred } from 'core/utils/deferred';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import fx from 'animation/fx';

import 'common.css!';
import 'generic_light.css!';

const { test, module, testStart } = QUnit;

testStart(() => {
    const markup =
        `<div id="lookup"></div>
        <div id="widthRootStyle" style="width: 300px;"></div>
        <div id="lookupFieldTemplate">
            <div data-options="dxTemplate: { name: 'field' }">
                <span>test</span>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

const LOOKUP_FIELD_CLASS = 'dx-lookup-field';

module('Lookup', {
    beforeEach: () => {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();

        this.element = $('#lookup');
        this.instance = this.element.dxLookup({ fullScreen: false }).dxLookup('instance');
        this.$field = $(this.instance._$field);
    },
    afterEach: () => {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    test('render dxLookup', (assert) => {
        assert.ok(this.instance instanceof Lookup);
        assert.ok(this.element.hasClass('dx-lookup'), 'widget has class dx-lookup');
        assert.ok($(`.${LOOKUP_FIELD_CLASS}`, this.element).length, 'widget contents field');
        assert.ok($('.dx-lookup-arrow', this.element).length, 'widget contents arrow');
    });

    test('regression: value is out of range (B231783)', (assert) => {
        this.instance.option({
            dataSource: [1, 2, 3],
            value: 'wrongValue'
        });

        assert.equal(this.$field.text(), 'Select...');
    });

    test('regression: B232016 - Lookup element has no \'dx-widget\' CSS class', (assert) => {
        assert.ok(this.element.hasClass('dx-widget'));
    });

    test('lookup empty class is attached when no item is selected', (assert) => {
        const $lookup = this.element.dxLookup({ dataSource: [1, 2, 3], showClearButton: true, placeholder: 'placeholder' });
        const LOOKUP_EMPTY_CLASS = 'dx-lookup-empty';

        assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), 'Lookup without preselected value has empty class');
    });

    test('data source should be paginated by default', (assert) => {
        assert.expect(1);

        const $element = $('#lookup').dxLookup({
            dataSource: [1, 2]
        });
        const instance = $element.dxLookup('instance');

        assert.equal(instance._dataSource.paginate(), true, 'pagination enabled by default');
    });

    test('T373464 - the \'fieldTemplate\' should be used for rendering if the item is get asynchronously', (assert) => {
        const fieldTemplateText = 'Field template';
        const items = ['1', '2'];
        const $element = $('#lookup').dxLookup({
            fieldTemplate: function() {
                return fieldTemplateText;
            },
            dataSource: {
                byKey: function(key) {
                    const d = new Deferred();
                    setTimeout(function() {
                        d.resolve(key);
                    }, 0);
                    return d.promise();
                },
                load: function() {
                    return items;
                }
            },
            value: items[0]
        });

        this.clock.tick(0);
        assert.equal($element.find(`.${LOOKUP_FIELD_CLASS}`).text(), fieldTemplateText, 'field template is used');
    });


    test('field template should be render one time per value rendering', (assert) => {
        const fieldTemplateStub = sinon.stub().returns($('<div>'));
        $('#widthRootStyle').dxLookup({
            fieldTemplate: fieldTemplateStub,
            dataSource: [1, 2, 3],
            value: 2
        });

        assert.ok(fieldTemplateStub.calledOnce, 'field template called once');
    });

    test('value should be rendered correctly when async data source has been used', (assert) => {
        const value = 'last name';

        this.element.dxLookup({
            dataSource: {
                load: () => {
                    return ['first name', 'last name', 'age'];
                },
                byKey: (key) => {
                    const d = new Deferred();
                    setTimeout(() => {
                        d.resolve(key);
                    }, 0);
                    return d.promise();
                }
            },
            value: value
        });

        this.clock.tick(0);

        assert.equal(this.element.find(`.${LOOKUP_FIELD_CLASS}`).text(), value, 'Field text is correct');
    });
});


module('hidden input', () => {
    test('a hidden input should be rendered', (assert) => {
        const $element = $('#lookup').dxLookup();
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.length, 1, 'a hidden input is rendered');
    });

    test('the hidden input should have correct value on widget init', (assert) => {
        const $element = $('#lookup').dxLookup({
            items: [1, 2, 3],
            value: 2
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.val(), '2', 'input value is correct');
    });

    test('the hidden input should get display text as value if widget value is an object', (assert) => {
        const items = [{ id: 1, text: 'one' }];
        const $element = $('#lookup').dxLookup({
            items: items,
            value: items[0],
            valueExpr: 'this',
            displayExpr: 'text'
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.val(), items[0].text, 'input value is correct');
    });

    test('the submit value must be equal to the value of the widget', (assert) => {
        const items = ['test'];
        const $element = $('#lookup').dxLookup({
            items: items,
            value: items[0],
            valueExpr: 'this',
            displayExpr: function(item) {
                if(item) {
                    return item + '123';
                }
            }
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.deepEqual($input.val(), items[0], 'input value is correct');
    });

    test('the hidden input should get value in respect of the \'valueExpr\' option', (assert) => {
        const items = [{ id: 1, text: 'one' }];
        const $element = $('#lookup').dxLookup({
            items: items,
            value: items[0].id,
            valueExpr: 'id',
            displayExpr: 'text'
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.val(), items[0].id, 'input value is correct');
    });
});


module('options', {
    beforeEach: () => {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    test('hidden input should get the \'name\' attribute with a correct value', (assert) => {
        const expectedName = 'lookup';
        const $element = $('#lookup').dxLookup({
            name: expectedName
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.attr('name'), expectedName, 'input has correct \'name\' attribute');
    });

    test('displayExpr, valueExpr as functions (regression B230600)', (assert) => {
        const instance = $('#lookup').dxLookup({
            dataSource: [1, 2],
            valueExpr: function(item) {
                return item * 2;
            },
            displayExpr: function(item) {
                return 'number ' + item;
            },
            value: 2
        }).dxLookup('instance');
        const $field = instance._$field;

        assert.equal($field.text(), 'number 1');
    });

    test('value', (assert) => {
        const items = [1, 2, 3];
        const instance = $('#lookup').dxLookup({ dataSource: items, value: 1 }).dxLookup('instance');
        const $field = $(instance._$field);

        assert.equal($field.text(), 1, 'field text is selected item value');
        assert.equal(instance.option('displayValue'), 1, 'displayValue is selected item value');
    });

    test('value should be assigned by reference', (assert) => {
        const items = [{ name: 'name' }];
        const instance = $('#lookup').dxLookup({
            dataSource: items,
            value: items[0],
            displayExpr: 'name'
        }).dxLookup('instance');
        const $field = $(instance._$field);

        assert.equal($field.text(), 'name', 'item was found in items by reference');
    });

    test('placeholder', (assert) => {
        const instance = $('#lookup').dxLookup({
            dataSource: []
        }).dxLookup('instance');

        assert.equal($(instance._$field).text(), 'Select...', 'default value');
    });

    test('fieldTemplate should be rendered', (assert) => {
        $('#lookupFieldTemplate').dxLookup({ fieldTemplate: 'field' });

        assert.equal($.trim($('#lookupFieldTemplate').text()), 'test', 'test was be rendered');
    });

    test('selected item should be passed as first argument if fieldTemplate is a function', (assert) => {
        const items = [{ id: 1, text: 'one', data: 11 }, { id: 2, text: 'two', data: 22 }];

        $('#lookup').dxLookup({
            items: items,
            valueExpr: 'id',
            displayExpr: 'text',
            value: items[1].id,
            fieldTemplate: function(item) {
                assert.deepEqual(item, items[1], 'selected item is passed to fieldTemplate function');

                return $('<div>').dxTextBox();
            }
        });
    });
});


module('widget sizing render', () => {
    test('constructor', (assert) => {
        const $element = $('#lookup').dxLookup({ width: 400 });
        const instance = $element.dxLookup('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.get(0).style.width, '400px', 'outer width of the element must be equal to custom width');
    });

    test('root with custom width', (assert) => {
        const $element = $('#widthRootStyle').dxLookup();
        const instance = $element.dxLookup('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.get(0).style.width, '300px', 'outer width of the element must be equal to custom width');
    });
});


module('aria accessibility', () => {
    test('aria role', (assert) => {
        const $element = $('#lookup').dxLookup();
        const $field = $element.find(`.${LOOKUP_FIELD_CLASS}:first`);

        assert.equal($field.attr('role'), 'combobox', 'aria role is on the field');
    });

});
