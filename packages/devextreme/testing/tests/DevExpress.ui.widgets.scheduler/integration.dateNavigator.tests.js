import $ from 'jquery';
import fx from 'common/core/animation/fx';
import '__internal/scheduler/m_scheduler';

import 'fluent_blue_light.css!';
import { createWrapper } from '../../helpers/scheduler/helpers.js';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = async function(options) {
            const scheduler = await createWrapper(options);
            this.instance = scheduler.instance;
        };
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Integration: Date navigator with min and max values', moduleConfig, function() {
    const DISABLED_CLASS_NAME = 'dx-state-disabled';
    const INIT_CURRENT_DATE = new Date(2017, 4, 25);

    const testNavigatorButtonsState = (assert, instance, cases) => {
        const $previousButton = $(instance.$element().find('.dx-scheduler-navigator-previous'));
        const $nextButton = $(instance.$element().find('.dx-scheduler-navigator-next'));

        assert.equal(instance.option('currentDate').valueOf(), INIT_CURRENT_DATE.valueOf(), 'currentDate value equal with init currentDate');
        cases.forEach(testCase => {
            assert.equal($previousButton.hasClass(DISABLED_CLASS_NAME), testCase.prevButtonDisable, 'the previous button has the disabled CSS class');
            assert.equal($nextButton.hasClass(DISABLED_CLASS_NAME), testCase.nextButtonDisable, 'the next button has the disabled CSS class');

            if(testCase.trigger) {
                $(testCase.trigger === 'next' ? $nextButton : $previousButton).trigger('dxclick');
            }
        });
        assert.equal(instance.option('currentDate').valueOf(), INIT_CURRENT_DATE.valueOf(), 'currentDate value is not changed');
    };

    QUnit.test('The navigator switcher should be disabled only one side in Day view mode, if currentDate property equal min property value (T714398)', async function(assert) {
        await this.createInstance({
            currentDate: INIT_CURRENT_DATE,
            min: '2017/05/25',
            max: '2017/05/26',
            views: ['day'],
            currentView: 'day'
        });

        testNavigatorButtonsState(assert, this.instance, [
            { prevButtonDisable: true, nextButtonDisable: false, trigger: 'next' },
            { prevButtonDisable: false, nextButtonDisable: true, trigger: 'prev' },
            { prevButtonDisable: true, nextButtonDisable: false }
        ]);
    });

    QUnit.test('The navigator switcher should be disabled only one side in Day view mode, if startDayHour property is set', async function(assert) {
        await this.createInstance({
            currentDate: INIT_CURRENT_DATE,
            min: new Date(2017, 4, 25),
            max: new Date(2017, 4, 27),
            startDayHour: 9,
            endDayHour: 19
        });

        testNavigatorButtonsState(assert, this.instance, [
            { prevButtonDisable: true, nextButtonDisable: false, trigger: 'next' },
            { prevButtonDisable: false, nextButtonDisable: false, trigger: 'next' },
            { prevButtonDisable: false, nextButtonDisable: true, trigger: 'prev' },
            { prevButtonDisable: false, nextButtonDisable: false, trigger: 'prev' }
        ]);
    });

    QUnit.test('The navigator switcher should be disabled only one side in Day view mode, if currentDate property equal max property value', async function(assert) {
        await this.createInstance({
            currentDate: INIT_CURRENT_DATE,
            min: '2017/05/24',
            max: '2017/05/25',
            views: ['day'],
            currentView: 'day'
        });

        testNavigatorButtonsState(assert, this.instance, [
            { prevButtonDisable: false, nextButtonDisable: true, trigger: 'prev' },
            { prevButtonDisable: true, nextButtonDisable: false, trigger: 'next' },
            { prevButtonDisable: false, nextButtonDisable: true }
        ]);
    });

    QUnit.test('The navigator switcher should be disabled only one side in Month view mode, if currentDate property equal min property value', async function(assert) {
        await this.createInstance({
            currentDate: INIT_CURRENT_DATE,
            min: new Date(2017, 4, 25),
            max: new Date(2017, 5, 25),
            views: ['month'],
            currentView: 'month'
        });

        testNavigatorButtonsState(assert, this.instance, [
            { prevButtonDisable: true, nextButtonDisable: false, trigger: 'next' },
            { prevButtonDisable: false, nextButtonDisable: true, trigger: 'prev' },
            { prevButtonDisable: true, nextButtonDisable: false }
        ]);
    });

    QUnit.test('Previous button shouldn\'t be disabled if current date is next day after min and equal new Date()', async function(assert) {
        await this.createInstance({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(),
            min: new Date()
        });

        $(this.instance.$element()).find('.dx-scheduler-navigator-next').trigger('dxclick');

        const prevButton = $(this.instance.$element()).find('.dx-scheduler-navigator-previous').dxButton('instance');
        assert.notOk(prevButton.option('disabled'), 'previous button isn\'t disabled');
    });

    QUnit.test('Next button shouldn\'t be disabled if current date is previous day before max', async function(assert) {
        await this.createInstance({
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2017, 11, 30),
            max: new Date(2017, 11, 31)
        });

        const nextButton = $(this.instance.$element()).find('.dx-scheduler-navigator-next').dxButton('instance');
        assert.notOk(nextButton.option('disabled'), 'next button isn\'t disabled');
    });

    QUnit.test('Min & Max options should be passed to header', async function(assert) {
        await this.createInstance({ currentDate: new Date(2015, 1, 9), min: new Date(2015, 1, 2), max: new Date(2015, 1, 4) });

        const header = $(this.instance.$element()).find('.dx-scheduler-header').dxSchedulerHeader('instance');

        assert.deepEqual(header.option('min'), new Date(2015, 1, 2), 'min is passed');
        assert.deepEqual(header.option('max'), new Date(2015, 1, 4), 'max is passed');

        this.instance.option('min', new Date(2015, 1, 1));
        assert.deepEqual(header.option('min'), new Date(2015, 1, 1), 'min is passed after option changed');

        this.instance.option('max', new Date(2015, 1, 5));
        assert.deepEqual(header.option('max'), new Date(2015, 1, 5), 'max is passed after option changed');
    });
});

QUnit.module('Integration: Date navigator', moduleConfig, function() {
    QUnit.test('Click on the \'next\' button should update currentDate', async function(assert) {

        await this.createInstance({ currentDate: new Date(2015, 1, 9) });

        $(this.instance.$element()).find('.dx-scheduler-navigator-next').trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2015, 1, 10), 'New date is correct');
    });

    QUnit.test('Click on the \'next\' button should update currentDate correctly, when intervalCount & startDate', async function(assert) {
        await this.createInstance(
            {
                currentDate: new Date(2015, 1, 9),
                startDayHour: 8,
                endDayHour: 20,
                views: [{
                    type: 'day',
                    intervalCount: 3,
                    startDate: new Date(2015, 1, 11)
                }]
            });

        $(this.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2015, 1, 11, 8), 'New date is correct');
    });

    QUnit.test('Click on the \'next\' button should update firstViewDate of workspace correctly, when intervalCount & startDate', async function(assert) {
        await this.createInstance(
            {
                startDayHour: 8,
                endDayHour: 20,
                currentDate: new Date(2017, 4, 1),
                views: [{
                    type: 'day',
                    intervalCount: 3,
                    startDate: new Date(2017, 3, 30)
                }]
            });

        $(this.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2017, 4, 3, 8, 0), 'New date is correct');
    });

    QUnit.test('Click on the \'previous\' button should update firstViewDate of workspace correctly, when intervalCount & startDate', async function(assert) {
        await this.createInstance(
            {
                startDayHour: 8,
                endDayHour: 20,
                currentDate: new Date(2017, 4, 1),
                views: [{
                    type: 'day',
                    intervalCount: 3,
                    startDate: new Date(2017, 3, 30)
                }]
            });

        $(this.instance.$element().find('.dx-scheduler-navigator-previous')).trigger('dxclick');

        assert.deepEqual(this.instance.getStartViewDate(), new Date(2017, 3, 27, 8, 0), 'New date is correct');
    });

    QUnit.test('Caption should be correct when intervalCount & startDate are set, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2018, 4, 21),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 2,
                startDate: new Date(2018, 4, 21)
            }] });

        const $caption = this.instance.$element().find('.dx-scheduler-navigator-caption');

        assert.equal($caption.text(), 'May-Jun 2018', 'Caption is correct');
    });

    QUnit.test('Click on the \'next\' button should update currentDate correctly, when intervalCount & startDate, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2017, 5, 9),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 3,
                startDate: new Date(2017, 11, 11)
            }] });

        $(this.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2017, 8, 1), 'New date is correct');
    });

    QUnit.test('Multiple click on the \'next\' button should update currentDate correctly when intervalCount, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2017, 8, 1),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 2
            }] });
        const $element = this.instance.$element();
        const $caption = $element.find('.dx-scheduler-navigator-caption');

        $($element.find('.dx-scheduler-navigator-next')).trigger('dxclick').trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2018, 0, 1), 'New date is correct');
        assert.equal($caption.text(), 'Jan-Feb 2018', 'Caption is correct');
    });

    QUnit.test('Multiple click on the \'next\' button should update currentDate correctly when intervalCount & startDate, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2018, 4, 21),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 2,
                startDate: new Date(2018, 4, 21)
            }] });
        const $element = this.instance.$element();
        const $caption = $element.find('.dx-scheduler-navigator-caption');

        $($element.find('.dx-scheduler-navigator-next')).trigger('dxclick').trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2018, 8, 1), 'New date is correct');
        assert.equal($caption.text(), 'Sep-Oct 2018', 'Caption is correct');
    });

    QUnit.test('Multiple click on the \'previous\' button should update currentDate correctly when intervalCount & startDate, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2018, 4, 21),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 2,
                startDate: new Date(2018, 4, 21)
            }] });
        const $element = this.instance.$element();
        const $caption = $element.find('.dx-scheduler-navigator-caption');

        $($element.find('.dx-scheduler-navigator-previous')).trigger('dxclick').trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2018, 0, 1), 'New date is correct');
        assert.equal($caption.text(), 'Jan-Feb 2018', 'Caption is correct');
    });

    QUnit.test('Multiple click on the \'next\' and \'previous\' button should update currentDate correctly, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2017, 4, 1),
            currentView: 'month',
            views: ['month']
        });

        const $nextButton = $(this.instance.$element().find('.dx-scheduler-navigator-next'));
        const $previousButton = $(this.instance.$element().find('.dx-scheduler-navigator-previous'));

        $nextButton.trigger('dxclick');
        $nextButton.trigger('dxclick');

        assert.equal(this.instance.option('currentDate').getMonth(), 6, 'New date is correct');

        $previousButton.trigger('dxclick');
        $previousButton.trigger('dxclick');

        assert.equal(this.instance.option('currentDate').getMonth(), 4, 'New date is correct');
    });

    QUnit.test('Multiple click on the \'next\' and \'previous\' button should update currentDate correctly when intervalCount, currentDate = startDate, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2017, 11, 11),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 3,
                startDate: new Date(2017, 11, 11)
            }] });

        const $nextButton = $(this.instance.$element().find('.dx-scheduler-navigator-next'));
        const $previousButton = $(this.instance.$element().find('.dx-scheduler-navigator-previous'));

        $nextButton.trigger('dxclick');
        $nextButton.trigger('dxclick');
        $previousButton.trigger('dxclick');
        $previousButton.trigger('dxclick');

        assert.equal(this.instance.option('currentDate').getMonth(), 11, 'New date is correct');
    });

    QUnit.test('Click on the \'previous\' button should update currentDate', async function(assert) {

        await this.createInstance({ currentDate: new Date(2015, 1, 9) });

        $(this.instance.$element()).find('.dx-scheduler-navigator-previous').trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2015, 1, 8), 'New date is correct');
    });

    QUnit.test('Click on the \'previous\' button should update currentDate correctly, when intervalCount & startDate', async function(assert) {

        await this.createInstance({ currentDate: new Date(2015, 1, 9), views: [{
            type: 'day',
            intervalCount: 3,
            startDate: new Date(2015, 1, 10)
        }] });

        $(this.instance.$element().find('.dx-scheduler-navigator-previous')).trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2015, 1, 4), 'New date is correct');
    });

    QUnit.test('Click on the \'previous\' button should update currentDate correctly, when intervalCount & startDate, month view', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2017, 5, 9),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 3,
                startDate: new Date(2017, 11, 11)
            }] });

        $(this.instance.$element().find('.dx-scheduler-navigator-previous')).trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2017, 2, 1), 'New date is correct');
    });

    QUnit.test('Tasks should be rerendered after click on next/prev button', async function(assert) {
        await this.createInstance({ currentDate: new Date(2015, 1, 24) });

        const spy = sinon.spy(this.instance, '_filterAppointmentsByDate');

        try {
            $(this.instance.$element()).find('.dx-scheduler-navigator-previous').trigger('dxclick');
            assert.ok(spy.calledOnce, 'filterByDate is called');
        } finally {
            this.instance._filterAppointmentsByDate.restore();
        }
    });

    QUnit.test('Tasks should have correct position after click on next/prev button & calendar', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2016, 0, 24),
            startDayHour: 2,
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: [{ startDate: new Date(2016, 0, 24, 3), endDate: new Date(2016, 0, 24, 4) }]
        });
        const $scheduler = $(this.instance.$element());

        const appointmentPosition = $scheduler.find('.dx-scheduler-appointment').position();

        $scheduler.find('.dx-scheduler-navigator-caption').trigger('dxclick');
        $('.dx-calendar td[data-value=\'2016/01/23\']').trigger('dxclick');
        $scheduler.find('.dx-scheduler-navigator-next').trigger('dxclick');

        const currentPosition = $scheduler.find('.dx-scheduler-appointment').position();
        assert.roughEqual(currentPosition.top, appointmentPosition.top, 1.001, 'position is not modified');
    });

    QUnit.test('Click on the \'next\' button should update currentDate correctly when intervalCount, month view, currentDate > 1', async function(assert) {
        await this.createInstance({
            currentDate: new Date(2018, 3, 21),
            currentView: 'month',
            views: [{
                type: 'month',
                intervalCount: 2
            }] });

        const $element = this.instance.$element();
        const $caption = $element.find('.dx-scheduler-navigator-caption');

        $($element.find('.dx-scheduler-navigator-next')).trigger('dxclick');

        assert.deepEqual(this.instance.option('currentDate'), new Date(2018, 5, 21), 'New date is correct');
        assert.equal($caption.text(), 'Jun-Jul 2018', 'Caption is correct');
    });

    QUnit.test('Calendar should be able to scroll content(T882633)', async function(assert) {
        const scheduler = await createWrapper();
        const { navigator } = scheduler.header;

        navigator.caption.click();
        assert.ok(navigator.popover.isVisible, 'navigator popup should be visible');

        if(scheduler.isDesktop) {
            assert.notOk(navigator.popover.hasScroll, 'calendar shouldn\'t wrapped in scrollable container in desktop environment');
        } else {
            assert.ok(navigator.popover.hasScroll, 'calendar should placed in scrollable container in mobile environment');
        }
    });
});
