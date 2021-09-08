import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Tooltip Template', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();

        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltip = this.$element.find(Consts.TOOLTIP_SELECTOR);
        let tooltipText = tooltip.text();
        const taskTitle = data.tasks[0].title;
        assert.equal(tooltipText.indexOf(taskTitle), 0, 'Default tooltip works correctly');
        ganttCore.taskEditController.tooltip.showProgress(10, 10);
        tooltipText = tooltip.text();
        assert.notEqual(tooltipText.indexOf(10), -1, 'Default progress tooltip works correctly');
        ganttCore.taskEditController.tooltip.showTime(data.tasks[0].start, data.tasks[0].end);
        tooltipText = tooltip.text();
        assert.notEqual(tooltipText.indexOf('Start'), -1, 'Default time tooltip works correctly 1');
        assert.notEqual(tooltipText.indexOf('End'), -1, 'Default time tooltip works correctly 2');


    });
    test('custom text', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestTooltipText';
        const customTooltipFunction = (item, container) => {
            return customTooltipText;
        };
        const customTimeTooltipText = 'TestTimeTooltipText';
        const customTimeTooltipFunction = (item, container) => {
            return customTimeTooltipText;
        };
        const customProgressTooltipText = 'TestProgressTooltipText';
        const customProgressTooltipFunction = (item, container) => {
            return customProgressTooltipText;
        };
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipFunction);
        this.instance.option('taskTimeTooltipContentTemplate', customTimeTooltipFunction);
        this.instance.option('taskProgressTooltipContentTemplate', customProgressTooltipFunction);
        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltip = this.$element.find(Consts.TOOLTIP_SELECTOR);
        let tooltipText = tooltip.text();
        assert.equal(tooltipText, customTooltipText, 'Custom template text works correctly');
        ganttCore.taskEditController.tooltip.showProgress(10, 10);
        tooltipText = tooltip.text();
        assert.equal(tooltipText, customProgressTooltipText, 'Custom progress template text works correctly');
        ganttCore.taskEditController.tooltip.showTime(data.tasks[0].start, data.tasks[0].end);
        tooltipText = tooltip.text();
        assert.equal(tooltipText, customTimeTooltipText, 'Custom time template text works correctly');
    });
    test('custom jQuery', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestCustomTooltipJQuery';
        const customTooltipJQuery = $('<div>' + customTooltipText + '</div>');
        const customTimeTooltipText = 'TestCustomTimeTooltipJQuery';
        const customTimeTooltipJQuery = $('<div>' + customTimeTooltipText + '</div>');
        const customProgressTooltipText = 'TestCustomProgressTooltipJQuery';
        const customProgressTooltipJQuery = $('<div>' + customProgressTooltipText + '</div>');
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipJQuery);
        this.instance.option('taskTimeTooltipContentTemplate', customTimeTooltipJQuery);
        this.instance.option('taskProgressTooltipContentTemplate', customProgressTooltipJQuery);

        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltip = this.$element.find(Consts.TOOLTIP_SELECTOR);
        let tooltipText = tooltip.text();
        assert.equal(tooltipText, customTooltipText, 'Custom template with jQuery works correctly');
        ganttCore.taskEditController.tooltip.showProgress(10, 10);
        tooltipText = tooltip.text();
        assert.equal(tooltipText, customProgressTooltipText, 'Custom progress template text works correctly');
        ganttCore.taskEditController.tooltip.showTime(data.tasks[0].start, data.tasks[0].end);
        tooltipText = tooltip.text();
        assert.equal(tooltipText, customTimeTooltipText, 'Custom time template text works correctly');
    });
    test('different tooltips for tasks', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestTooltipText';
        const customTooltipFunction = (task, container) => {
            if(task.id === 3 || task.id === 4) {
                return customTooltipText;
            }
            return;
        };
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipFunction);
        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        this.clock.tick();
        ganttCore.taskEditController.show(1);
        ganttCore.taskEditController.showTaskInfo(0, 0);
        this.clock.tick();
        const tooltipDisplayStyle = this.$element.find(Consts.TOOLTIP_SELECTOR)[0].style.display;
        assert.equal(tooltipDisplayStyle, 'none', 'Empty content template doesnt show tooltip');
        ganttCore.taskEditController.tooltip.hide();
        this.clock.tick();
        ganttCore.taskEditController.show(2);
        ganttCore.taskEditController.showTaskInfo(0, 0);
        this.clock.tick();
        const tooltipText = this.$element.find(Consts.TOOLTIP_SELECTOR).text();
        assert.equal(tooltipText, customTooltipText, 'Custom template text works correctly');
    });
});
