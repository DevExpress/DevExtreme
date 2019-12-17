import $ from 'jquery';

import VariableFormat from 'ui/html_editor/formats/variable';
import Variables from 'ui/html_editor/modules/variables';
import { noop } from 'core/utils/common';

const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');

        this.log = [];
        this._keyBindingStub = sinon.stub();

        this.quillMock = {
            insertEmbed: (position, format, value) => {
                this.log.push({ position: position, format: format, value: value });
            },
            keyboard: {
                addBinding: this._keyBindingStub
            },
            getLength: () => 0,
            getBounds: () => { return { left: 0, bottom: 0 }; },
            root: this.$element.get(0),
            getModule: noop,
            getSelection: noop,
            setSelection: noop,
            getFormat: noop
        };

        this.options = {
            dataSource: ['TEST_NAME', 'TEST_COMPANY'],
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };
    },
    afterEach: function() {
        this.clock.reset();
    }
};

const { test } = QUnit;

QUnit.module('Variable format', () => {
    test('Create an element by data', function(assert) {
        const data = {
            value: 'TEST_NAME',
            escapeChar: '@'
        };
        const element = VariableFormat.create(data);

        assert.equal(element.dataset.varStartEscChar, '@', 'correct start escape char');
        assert.equal(element.dataset.varEndEscChar, '@', 'correct end escape char');
        assert.equal(element.dataset.varValue, 'TEST_NAME', 'correct inner text');
        assert.equal(element.innerText, '@TEST_NAME@', 'correct inner text');
    });

    test('Create an element with default escape char', function(assert) {
        const data = {
            value: 'TEST_NAME',
            escapeChar: ''
        };
        const element = VariableFormat.create(data);

        assert.equal(element.dataset.varStartEscChar, '', 'correct start escape char');
        assert.equal(element.dataset.varEndEscChar, '', 'correct end escape char');
        assert.equal(element.dataset.varValue, 'TEST_NAME', 'correct inner text');
        assert.equal(element.innerText, 'TEST_NAME', 'correct inner text');
    });

    test('Create an element with start escaping char', function(assert) {
        const data = {
            value: 'TEST_NAME',
            escapeChar: ['{', ''],
        };
        const element = VariableFormat.create(data);

        assert.equal(element.dataset.varValue, 'TEST_NAME', 'correct inner text');
        assert.equal(element.dataset.varStartEscChar, '{', 'There is no start char');
        assert.notOk(element.dataset.varEndEscChar, 'There is no end char');
        assert.equal(element.innerText, '{TEST_NAME', 'correct inner text');
    });

    test('Create an element with end escaping char', function(assert) {
        const data = {
            value: 'TEST_NAME',
            escapeChar: ['', '}'],
        };
        const element = VariableFormat.create(data);

        assert.equal(element.dataset.varValue, 'TEST_NAME', 'correct inner text');
        assert.notOk(element.dataset.varStartEscChar, 'There is no start char');
        assert.equal(element.dataset.varEndEscChar, '}', 'There is no end char');
        assert.equal(element.innerText, 'TEST_NAME}', 'correct inner text');
    });

    test('Create an element with start, end and default escaping char', function(assert) {
        const data = {
            value: 'TEST_NAME',
            escapeChar: ['{', '}']
        };
        const element = VariableFormat.create(data);

        assert.equal(element.dataset.varValue, 'TEST_NAME', 'correct inner text');
        assert.equal(element.dataset.varStartEscChar, '{', 'There is no start char');
        assert.equal(element.dataset.varEndEscChar, '}', 'There is no end char');
        assert.equal(element.innerText, '{TEST_NAME}', 'correct inner text');
    });

    test('Get data from element', function(assert) {
        const markup = '<span class=\'dx-variable\' data-var-start-esc-char=## data-var-value=TEST_NAME><span>##TEST_NAME##</span></span>';
        const element = $(markup).get(0);
        const data = VariableFormat.value(element);

        assert.deepEqual(data, { value: 'TEST_NAME', escapeChar: ['##', ''] }, 'Correct data');
    });
});

QUnit.module('Variables module', moduleConfig, () => {
    test('insert variable after click on item', function(assert) {
        this.options.escapeChar = '#';
        const variables = new Variables(this.quillMock, this.options);

        variables.showPopup();
        $(`.${SUGGESTION_LIST_CLASS} .dx-item`).first().trigger('dxclick');

        this.clock.tick();

        assert.deepEqual(this.log, [{
            format: 'variable',
            position: 0,
            value: {
                escapeChar: '#',
                value: 'TEST_NAME'
            }
        }], 'Correct formatting');
    });

});
