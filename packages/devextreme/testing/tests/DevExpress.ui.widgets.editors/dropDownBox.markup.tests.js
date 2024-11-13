import $ from 'jquery';
import { CustomStore } from 'common/data/custom_store';
import DropDownBox from 'ui/drop_down_box';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';


QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownBox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.$element = $('#dropDownBox');
        this.simpleItems = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('dropDownBox markup', moduleConfig, () => {
    QUnit.test('dropDownBox should have correct class', function(assert) {
        this.$element.dxDropDownBox({});

        assert.ok(this.$element.hasClass(DROP_DOWN_BOX_CLASS), 'element has correct class');
    });

    QUnit.test('expressions', function(assert) {
        this.$element.dxDropDownBox({
            items: this.simpleItems,
            valueExpr: 'id',
            displayExpr: 'name',
            value: 1
        });

        const $input = this.$element.find('.dx-texteditor-input');
        assert.equal($input.val(), 'Item 1', 'expressions work');
    });

    QUnit.test('field template should work', function(assert) {
        new DropDownBox(this.$element, {
            items: this.simpleItems,
            opened: true,
            fieldTemplate: function(value, fieldElement) {
                assert.equal(isRenderer(fieldElement), !!config().useJQuery, 'fieldElement is correct');
                return $('<div>').dxTextBox({ value: 1 });
            },
            valueExpr: 'id',
            displayExpr: 'name',
            value: 1
        });
    });
});

QUnit.module('hidden input', moduleConfig, () => {
    QUnit.test('a hidden input should be rendered', function(assert) {
        this.$element.dxDropDownBox();

        const $input = this.$element.find('input[type=\'hidden\']');

        assert.equal($input.length, 1, 'a hidden input is rendered');
    });

    QUnit.test('the hidden input should have correct value on widget init', function(assert) {
        this.$element.dxDropDownBox({
            items: [1, 2, 3],
            value: 2
        });

        const $input = this.$element.find('input[type=\'hidden\']');

        assert.equal($input.val(), '2', 'input value is correct');
    });

    QUnit.test('the hidden input should get correct value on widget value change', function(assert) {
        this.$element.dxDropDownBox({
            items: [1, 2, 3],
            value: 2
        });

        const instance = this.$element.dxDropDownBox('instance');
        const $input = this.$element.find('input[type=\'hidden\']');

        instance.option('value', 1);
        assert.equal($input.val(), '1', 'input value is correct');
    });

    QUnit.test('the hidden input should get display text as value if widget value is an object', function(assert) {
        const items = [{ id: 1, text: 'one' }];

        this.$element.dxDropDownBox({
            items: items,
            value: items[0],
            valueExpr: 'this',
            displayExpr: 'text'
        });

        const $input = this.$element.find('input[type=\'hidden\']');

        assert.equal($input.val(), items[0].text, 'input value is correct');
    });

    QUnit.test('the submit value must be equal to the value of the widget', function(assert) {
        const items = ['test'];

        this.$element.dxDropDownBox({
            items: items,
            value: items[0],
            valueExpr: 'this',
            displayExpr: function(item) {
                if(item) {
                    return item + '123';
                }
            }
        });

        const $input = this.$element.find('input[type=\'hidden\']');

        assert.deepEqual($input.val(), items[0], 'submit value should be equal to editor value');
    });

    QUnit.test('the hidden input should get value in respect of the \'valueExpr\' option', function(assert) {
        const items = [{ id: 1, text: 'one' }];

        this.$element.dxDropDownBox({
            items: items,
            value: items[0].id,
            valueExpr: 'id',
            displayExpr: 'text'
        });

        const $input = this.$element.find('input[type=\'hidden\']');

        assert.equal($input.val(), items[0].id, 'input value is correct');
    });


    QUnit.test('the hidden input should get correct values if async data source is used', function(assert) {
        const data = [0, 1, 2, 3, 4];
        const initialValue = 2;
        const newValue = 4;
        const timeout = 100;
        const store = new CustomStore({
            load: function() {
                const d = $.Deferred();
                setTimeout(function() {
                    d.resolve(data);
                }, timeout);
                return d.promise();
            },
            byKey: function(key) {
                const d = $.Deferred();
                setTimeout(function() {
                    d.resolve(key);
                }, timeout);
                return d.promise();
            }
        });
        const $element = this.$element.dxDropDownBox({
            dataSource: store,
            value: initialValue,
            valueExpr: 'id',
            displayExpr: 'name'
        });
        const instance = $element.dxDropDownBox('instance');

        this.clock.tick(timeout);

        assert.equal($element.find('input[type=\'hidden\']').val(), initialValue, 'first rendered option value is correct');

        instance.option('value', newValue);
        this.clock.tick(timeout);
        assert.equal($element.find('input[type=\'hidden\']').val(), newValue, 'first rendered option value is correct');
    });
});

QUnit.module('the \'name\' option', moduleConfig, () => {
    QUnit.test('widget hidden input should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = this.$element.dxDropDownBox({
            name: expectedName
        });
        const $input = $element.find('input[type=\'hidden\']');

        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });
});

