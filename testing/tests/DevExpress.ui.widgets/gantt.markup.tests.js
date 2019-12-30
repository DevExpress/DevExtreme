import $ from 'jquery';
import 'ui/gantt';
import 'common.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $('#qunit-fixture').html(markup);
});

const GANTT_CLASS = 'dx-gantt';
const GANTT_VIEW_CLASS = GANTT_CLASS + '-view';

QUnit.module('rendering', {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body');
    },
    afterEach: function() {
        this.element.remove();
    }
}, () => {
    QUnit.test('base elements should be rendered correctly', function(assert) {
        const $element = this.element.dxGantt();

        assert.ok($element.hasClass(GANTT_CLASS), 'element has a widget-specific class');
        assert.equal($element.find('.' + GANTT_VIEW_CLASS).length, 1, 'ganttView wrapper attached');
    });
});

