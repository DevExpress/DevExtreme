import $ from 'jquery';
import 'ui/gantt';

QUnit.testStart(function() {
    const markup =
        '<div id="widget"></div>\
        <div id="widthRootStyle"></div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

const GANTT_CLASS = 'dx-gantt';
const GANTT_VIEW_CLASS = GANTT_CLASS + '-view';

QUnit.module('rendering', {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.element.remove();
        this.clock.restore();
    }
}, () => {
    QUnit.test('base elements should be rendered correctly', function(assert) {
        const $element = this.element.dxGantt();

        assert.ok($element.hasClass(GANTT_CLASS), 'element has a widget-specific class');
        assert.equal($element.find('.' + GANTT_VIEW_CLASS).length, 1, 'ganttView wrapper attached');
    });
});

