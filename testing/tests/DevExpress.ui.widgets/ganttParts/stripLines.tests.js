import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Strip Lines', moduleConfig, () => {
    test('render', function(assert) {
        const stripLines = [
            { start: data.tasks[0].start, title: 'First' },
            { start: new Date(2019, 2, 1) },
            { start: new Date(2019, 5, 5), end: () => data.tasks[data.tasks.length - 1].end, title: 'Interval', cssClass: 'end' }
        ];
        const options = {
            tasks: { dataSource: data.tasks },
            stripLines: stripLines
        };
        this.createInstance(options);
        this.clock.tick();

        const $stripLines = this.$element.find(Consts.TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 2, 'all strip lines are rendered');
        const $timeIntervals = this.$element.find(Consts.TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 1, 'all time intervals are rendered');
        assert.ok($timeIntervals.eq(0).hasClass(stripLines[2].cssClass), 'custom cssClass rendered');
        assert.equal($stripLines.eq(0).attr('title'), stripLines[0].title, 'title rendered');
    });
    test('changing', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();

        let $stripLines = this.$element.find(Consts.TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 0, 'gantt has no strip lines');
        let $timeIntervals = this.$element.find(Consts.TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 0, 'gantt has no time intervals');

        this.instance.option('stripLines', [
            { start: data.tasks[0].start },
            { start: data.tasks[data.tasks.length - 1].start, end: data.tasks[data.tasks.length - 1].end }
        ]);
        $stripLines = this.$element.find(Consts.TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 1, 'gantt has strip line');
        $timeIntervals = this.$element.find(Consts.TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 1, 'gantt has time interval');

        this.instance.option('stripLines', []);
        $stripLines = this.$element.find(Consts.TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 0, 'gantt has no strip lines');
    });
});
