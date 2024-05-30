import $ from 'jquery';
import 'ui/gantt';
import devices from 'core/devices';
import { tasks } from './taskData.js';

const { test } = QUnit;

const device = devices.real();

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

QUnit.module('Scrolling', moduleConfig, () => {
    if(device.deviceType === 'desktop') {
        test('scrolling jump on edit last task (T1233562)', function(assert) {
            const options = {
                tasks: { dataSource: tasks },
                height: 700,
                editing: { enabled: true },
                columns: [
                    { dataField: 'title', caption: 'Subject', width: 300 },
                    { dataField: 'start', caption: 'Start Date' },
                    { dataField: 'end', caption: 'End Date' }
                ],
                scaleType: 'weeks',
            };

            this.createInstance(options);
            this.clock.tick(10);

            const gantt = this.instance;
            const treeListScrollView = gantt._treeList.getScrollable();
            const ganttViewScrollView = gantt._ganttView.getTaskAreaContainer();

            ganttViewScrollView.scrollTop = 1000;
            this.clock.tick(100);

            const savedTreeListScroll = treeListScrollView.scrollTop();
            assert.equal(savedTreeListScroll, ganttViewScrollView.scrollTop, 'treelist and gantt scroll not synchronized');

            gantt.updateTask('87', { title: 'new' });
            this.clock.tick(400);

            assert.ok(Math.abs(treeListScrollView.scrollTop() - savedTreeListScroll) <= 1, 'treelist scroll changed');
        });
    }
});


