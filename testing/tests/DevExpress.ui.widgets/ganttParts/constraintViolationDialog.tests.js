import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const DependencyType = {
    FS: 0, // Finish to start - predecessor should be finished before successor starts
    SS: 1, // Start to start - predecessor should be started before successor starts
    FF: 2, // Finish to finish - predecessor should be finished before successor finishes
    SF: 3 // Start to Finish - predecessor should be started before successor finishes
};

const data = {
    tasks: [
        { id: '1', title: 'Task 1', start: new Date(2019, 0, 1), end: new Date(2019, 0, 15), progress: 0 },
        { id: '2', title: 'Task 2', start: new Date(2019, 0, 2), end: new Date(2019, 0, 15), progress: 0 },
        { id: '3', title: 'Task 3', start: new Date(2019, 0, 15), end: new Date(2019, 0, 23), progress: 0 },
        // SS (2)
        { id: '4', title: 'Task 4', start: new Date(2019, 0, 13), end: new Date(2019, 0, 18), progress: 0 },
        { id: '5', title: 'Task 5', start: new Date(2019, 0, 13), end: new Date(2019, 0, 21), progress: 0 },
        { id: '6', title: 'Task 6', start: new Date(2019, 0, 13), end: new Date(2019, 0, 15), progress: 0 },
        // FF (2)
        { id: '7', title: 'Task 7', start: new Date(2019, 0, 14), end: new Date(2019, 0, 20), progress: 0 },
        { id: '8', title: 'Task 8', start: new Date(2019, 0, 13), end: new Date(2019, 0, 20), progress: 0 },
        { id: '9', title: 'Task 9', start: new Date(2019, 0, 12), end: new Date(2019, 0, 20), progress: 0 },
        // SF (2)
        { id: '10', title: 'Task 10', start: new Date(2019, 0, 14), end: new Date(2019, 0, 20), progress: 0 },
        { id: '11', title: 'Task 11', start: new Date(2019, 0, 14), end: new Date(2019, 0, 20), progress: 0 },
        { id: '12', title: 'Task 12', start: new Date(2019, 0, 12), end: new Date(2019, 0, 14), progress: 0 }
    ],
    dependencies: [
        // FS
        { id: '1', predecessorId: '1', successorId: '3', type: DependencyType.FS },
        { id: '2', predecessorId: '2', successorId: '3', type: DependencyType.FS },

        // SS
        { id: '3', predecessorId: '4', successorId: '6', type: DependencyType.SS },
        { id: '4', predecessorId: '5', successorId: '6', type: DependencyType.SS },

        // FF
        { id: '5', predecessorId: '7', successorId: '9', type: DependencyType.FF },
        { id: '6', predecessorId: '8', successorId: '9', type: DependencyType.FF },

        // SF
        { id: '7', predecessorId: '10', successorId: '12', type: DependencyType.SF },
        { id: '8', predecessorId: '11', successorId: '12', type: DependencyType.SF }
    ],
};
const dependency_options = {
    tasks: { dataSource: data.tasks },
    dependencies: { dataSource: data.dependencies },
    editing: { enabled: true },
    validation: { validateDependencies: true }
};

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

QUnit.module('ConstraintViolationDialog', moduleConfig, () => {
    test('FS, critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('3', { start: new Date(2019, 0, 14) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 2, '2 options for critical errors');
    });
    test('FS, no critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('3', { start: new Date(2019, 0, 16) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 3, '3 options for no critical errors');
    });
    test('SS, critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('6', { start: new Date(2019, 0, 12) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 2, '2 options for critical errors');
    });
    test('SS, no critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('6', { start: new Date(2019, 0, 14) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 3, '3 options for no critical errors');
    });
    test('FF, critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('9', { end: new Date(2019, 0, 19) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 2, '2 options for critical errors');
    });
    test('FF, no critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('9', { end: new Date(2019, 0, 22) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 3, '3 options for no critical errors');
    });
    test('SF, critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('12', { end: new Date(2019, 0, 13) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 2, '2 options for critical errors');
    });
    test('SF, no critical errors', function(assert) {
        this.createInstance(dependency_options);
        this.clock.tick(10);
        this.instance.updateTask('12', { end: new Date(2019, 0, 15) });
        this.clock.tick(10);

        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $options = $dialog.find(Consts.RADIO_BUTTON_SELECTOR);
        assert.equal($options.length, 3, '3 options for no critical errors');
    });
});
