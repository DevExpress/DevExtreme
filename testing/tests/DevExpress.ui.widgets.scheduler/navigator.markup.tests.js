import $ from 'jquery';
import { Navigator } from 'ui/scheduler/header/navigator';
import dateLocalization from 'localization/date';
import devices from 'core/devices';
import noop from 'core/utils/common';
import 'ui/scheduler/ui.scheduler';

// QUnit.testStart(() => {
const markup =
        '<div id="navigator"> </div>';

$('#qunit-fixture').html(markup);
// });

const moduleConfig = {
    beforeEach: function() {
        this.instance = $('#navigator').dxSchedulerNavigator().dxSchedulerNavigator('instance');
        this.instance.notifyObserver = noop.noop;
    }
};

QUnit.module('Navigator markup', moduleConfig, () => {
    QUnit.test('Scheduler navigator should be initialized', function(assert) {
        assert.ok(this.instance instanceof Navigator, 'dxSchedulerNavigator was initialized');
    });

    QUnit.test('Scheduler navigator should have a right css class', function(assert) {
        const $element = this.instance.$element();

        assert.ok($element.hasClass('dx-scheduler-navigator'), 'dxSchedulerNavigator has \'dx-scheduler-navigator\' css class');
    });

    QUnit.test('Scheduler navigator should contain the \'next\' button', function(assert) {
        const $element = this.instance.$element();

        const $button = $element.find('.dx-scheduler-navigator-next');

        assert.equal($button.length, 1, 'Navigator \'next\' is rendered');
        assert.ok($button.hasClass('dx-button'), 'Navigator \'next\' is dxButton');
        assert.equal($button.attr('aria-label'), 'Next period', 'Navigator \'next\' button has right label');
    });

    QUnit.test('Scheduler navigator should contain the \'previous\' button', function(assert) {
        const $element = this.instance.$element();

        const $button = $element.find('.dx-scheduler-navigator-previous');

        assert.equal($button.length, 1, 'Navigator \'previous\' is rendered');
        assert.ok($button.hasClass('dx-button'), 'Navigator \'previous\' is dxButton');
        assert.equal($button.attr('aria-label'), 'Previous period', 'Navigator \'previous\' button has right label');
    });

    QUnit.test('Scheduler navigator should contain the \'caption\' button', function(assert) {
        const $element = this.instance.$element();

        const $button = $element.find('.dx-scheduler-navigator-caption');

        assert.equal($button.length, 1, 'Navigation \'caption\' is rendered');
        assert.ok($button.hasClass('dx-button'), 'Navigator \'caption\' is dxButton');
    });

    QUnit.test('Caption should be OK with default options', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date();
        const caption = [dateLocalization.format(date, 'day'), dateLocalization.format(date, 'monthAndYear')].join(' ');

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('customizeDateNavigatorText shoulde be applied correctly', function(assert) {
        const $element = this.instance.$element();
        const date = new Date(2018, 11, 14, 9, 20);
        const caption = [dateLocalization.format(date, 'day'), dateLocalization.format(date, 'monthAndYear')].join(' ');

        this.instance.option('date', date);
        this.instance.option('customizeDateNavigatorText', function(args) {
            assert.deepEqual(args.startDate, date, 'passed date is ok');
            assert.deepEqual(args.endDate, date, 'passed date is ok');
            assert.equal(args.text, caption, 'passed text is ok');

            return 'Custom text is ' + args.text;
        });

        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        assert.equal(button.option('text'), 'Custom text is ' + caption, 'Caption is OK');
    });


    QUnit.test('Caption should be OK when step and date are changed', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 0, 24);
        let caption = '24 January 2015';

        this.instance.option('firstDayOfWeek', 1);
        this.instance.option('date', date);
        assert.equal(button.option('text'), caption, 'Step is day: Caption is OK');

        let weekDateString = devices.real().generic ? '25 January 2015' : '25 Jan 2015';

        caption = '19-' + weekDateString;

        this.instance.option('step', 'week');
        assert.equal(button.option('text'), caption, 'Step is week: Caption is OK');

        weekDateString = devices.real().generic ? '23 January 2015' : '23 Jan 2015',
        caption = '19-' + weekDateString;

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');

        caption = dateLocalization.format(date, 'monthandyear');
        this.instance.option('step', 'month');
        assert.equal(button.option('text'), caption, 'Step is month: Caption is OK');


        this.instance.option('step', 'agenda');

        weekDateString = devices.real().generic ? '30 January 2015' : '30 Jan 2015';
        caption = '24-' + weekDateString;

        assert.equal(button.option('text'), caption, 'Step is agenda: Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view & firstDayOfWeek = 0', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 0, 24);

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('date', date);

        const caption = devices.real().generic ? '19-23 January 2015' : '19-23 Jan 2015';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });

    QUnit.test('Caption should be OK for Day with intervalCount', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 4, 25);
        const caption = '25-27 May 2015';

        this.instance.option('date', date);
        this.instance.option('intervalCount', 3);

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view with intervalCount', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 4, 25);
        const caption = '25 May-12 Jun 2015';

        this.instance.option('firstDayOfWeek', 1);
        this.instance.option('date', date);
        this.instance.option('intervalCount', 3),
        this.instance.option('step', 'workWeek');

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('Caption should be OK for week view with intervalCount', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 4, 25);
        const caption = '25 May-14 Jun 2015';

        this.instance.option('firstDayOfWeek', 1);
        this.instance.option('date', date);
        this.instance.option('intervalCount', 3),
        this.instance.option('step', 'week');

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('Caption should be OK for Month with intervalCount', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2017, 4, 25);
        const caption = 'May-Jun 2017';

        this.instance.option('date', date);
        this.instance.option('intervalCount', 2);
        this.instance.option('step', 'month');

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('Caption should be OK for Month with intervalCount for different years', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2017, 10, 25);
        const caption = 'Nov 2017-Jan 2018';

        this.instance.option('date', date);
        this.instance.option('intervalCount', 3);
        this.instance.option('step', 'month');

        assert.equal(button.option('text'), caption, 'Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view, if date = Sunday', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2016, 0, 10);

        this.instance.option('firstDayOfWeek', 0);
        this.instance.option('date', date);

        const caption = devices.real().generic ? '11-15 January 2016' : '11-15 Jan 2016';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view, if date = Sunday and firstDayOfWeek != 0', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2016, 0, 10);

        this.instance.option('firstDayOfWeek', 3);
        this.instance.option('date', date);

        const caption = devices.real().generic ? '6-12 January 2016' : '6-12 Jan 2016';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view, if date = Saturday & firstDayOfWeek = 6', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2016, 0, 9);

        this.instance.option('firstDayOfWeek', 6);
        this.instance.option('date', date);

        const caption = devices.real().generic ? '11-15 January 2016' : '11-15 Jan 2016';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view, if date = Sunday & firstDayOfWeek = 6', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2016, 0, 10);

        this.instance.option('firstDayOfWeek', 6);
        this.instance.option('date', date);

        const caption = devices.real().generic ? '11-15 January 2016' : '11-15 Jan 2016';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });

    QUnit.test('Caption should be OK for week view, if date = Sunday & firstDayOfWeek = 1', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 2, 1);

        this.instance.option('firstDayOfWeek', 1);
        this.instance.option('date', date);

        this.instance.option('step', 'week');
        assert.equal(button.option('text'), '23 Feb-1 Mar 2015', 'Step is week: Caption is OK');
    });

    QUnit.test('Caption should be OK for agenda view, different months', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');
        const date = new Date(2015, 2, 29);

        this.instance.option('date', date);

        this.instance.option('step', 'agenda');
        assert.equal(button.option('text'), '29 Mar-4 Apr 2015', 'Step is week: Caption is OK');
    });

    QUnit.test('Caption should be OK for workWeek view and depends on displayedDate', function(assert) {
        const $element = this.instance.$element();
        const button = $element.find('.dx-scheduler-navigator-caption').dxButton('instance');

        this.instance.option('firstDayOfWeek', 6);
        this.instance.option('date', new Date(2016, 0, 10));
        this.instance.option('displayedDate', new Date(2016, 1, 13));

        const caption = devices.real().generic ? '15-19 February 2016' : '15-19 Feb 2016';

        this.instance.option('step', 'workWeek');
        assert.equal(button.option('text'), caption, 'Step is workWeek: Caption is OK');
    });
});
