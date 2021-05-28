import $ from 'jquery';
import 'ui/gantt';
import { options, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('First day of week', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('scaleType', 'days');
        this.instance.option('firstDayOfWeek', 0);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 0, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 1);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 1, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 2);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 2, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 3);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 3, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 4);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 4, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 5);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 5, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 6);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 6, 'incorrect first day');
    });
});
