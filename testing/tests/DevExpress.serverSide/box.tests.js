import '../DevExpress.ui.widgets/box.markup.tests.js';
import Box from 'ui/box';
import DOMAdapter from 'core/dom_adapter';

var BOX_ITEM_CLASS = 'dx-box-item';

var emulateServerSideFlexBehavior = function(element) {
    // NOTE: https://github.com/fgnass/domino/issues/119
    [ 'flex', 'flexDirection', 'flexBasis', 'flexGrow', 'flexShrink' ].forEach(function(prop) {
        var originalPropValue = element.style[prop];
        Object.defineProperty(element.style, prop, {
            get: function() {
                return originalPropValue;
            },
            set: function(value) {
                originalPropValue = value;
            }
        });
    });
};

QUnit.module('SSR specific for Box', {
    beforeEach: function() {
        var fixture = document.getElementById('qunit-fixture');
        this.element = document.createElement('div');
        fixture.appendChild(this.element);

        emulateServerSideFlexBehavior(this.element);

        this.originalCreateElement = DOMAdapter.createElement;

        DOMAdapter.createElement = function(tagName) {
            var result = this.originalCreateElement.apply(this, arguments);
            emulateServerSideFlexBehavior(result);
            return result;
        }.bind(this);
    },
    afterEach: function() {
        DOMAdapter.createElement = this.originalCreateElement;
    }
});

QUnit.test('Flex props should exist in style attribute', function(assert) {
    new Box(this.element, {
        items: [
            { baseSize: 3, ratio: 4, shrink: 5 }
        ],
        direction: 'row'
    });

    [
        'display: flex;',
        'flex-direction: row;'
    ].forEach(style => assert.ok(this.element.attributes.style.value.indexOf(style) > -1));

    var itemElement = this.element.querySelectorAll('.' + BOX_ITEM_CLASS)[0];

    [
        'display: flex;',
        'flex-basis: 3px;',
        'flex-grow: 4;',
        'flex-shrink: 5;'
    ].forEach(style => assert.ok(itemElement.attributes.style.value.indexOf(style) > -1));
});
