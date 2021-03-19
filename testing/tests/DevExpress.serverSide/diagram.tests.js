import $ from 'jquery';
import 'ui/diagram';

QUnit.testStart(function() {
    const markup =
        '<div id="widget"></div>';

    $('#qunit-fixture').html(markup);
});

const DIAGRAM_CLASS = 'dx-diagram';
const DIAGRAM_CORE_CLASS = 'dxdi-control';

QUnit.module('rendering', {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body');
    },
    afterEach: function() {
        this.element.remove();
    }
}, () => {
    QUnit.test('base elements should be rendered correctly', function(assert) {
        const $element = this.element.dxDiagram();

        assert.ok($element.hasClass(DIAGRAM_CLASS), 'Element has a widget-specific class');
        assert.equal($element.find('.' + DIAGRAM_CORE_CLASS).length, 0, 'Diagram core must not be created in server-side');
    });
});

