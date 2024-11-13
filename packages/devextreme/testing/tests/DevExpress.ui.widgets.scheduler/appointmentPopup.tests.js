import 'generic_light.css!';

import { initTestMarkup, createWrapper, isDesktopEnvironment } from '../../helpers/scheduler/helpers.js';

import $ from 'jquery';
import devices from '__internal/core/m_devices';
import SelectBox from 'ui/select_box';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import resizeCallbacks from 'core/utils/resize_callbacks';
import messageLocalization from 'common/core/localization/message';
import { APPOINTMENT_FORM_GROUP_NAMES } from '__internal/scheduler/appointment_popup/m_form';
import { dateToMilliseconds as toMs } from 'core/utils/date';
import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import viewPort from 'core/utils/view_port';

const { module, test, testStart } = QUnit;

const APPOINTMENT_POPUP_WIDTH = 485;
const APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE = 970;
const checkFormWithRecurrenceEditor = (assert, instance, visibility) => {
    const width = visibility === true ? APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE : APPOINTMENT_POPUP_WIDTH;
    const colSpan = visibility === true ? 1 : 2;
    const form = instance.getAppointmentDetailsForm();

    assert.equal(form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence).visible,
        visibility, `Recurrence Editor is ${visibility === true ? 'visible' : 'not visible'}`);

    assert.equal(form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Main).colSpan, colSpan, 'colSpan of main group is correct');
    assert.equal(form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence).colSpan, colSpan, 'colSpan of recurrence group is correct');

    assert.equal(instance._appointmentPopup.popup.option('maxWidth'), width, 'maxWidth of popup is correct');
};

const createInstance = (options) => {
    const defaultOption = {
        dataSource: [],
        maxAppointmentsPerCell: 2
    };

    return createWrapper($.extend(defaultOption, options));
};

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
    }
};

const defaultData = [
    {
        text: 'recurrent-app',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    }, {
        text: 'common-app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
    }
];

const createScheduler = (options = {}, clock) => {
    const defaultOption = {
        dataSource: defaultData,
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2017, 4, 25),
        firstDayOfWeek: 1,
        startDayHour: 9,
        height: 600,
        width: 600
    };

    return createWrapper($.extend(defaultOption, options), clock);
};

const setWindowWidth = width => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
        get: () => width,
        configurable: true
    });
};

const resetWindowWidth = () => delete document.documentElement.clientWidth;

testStart(() => {
    initTestMarkup();
    viewPort.value($('.shadow-container').get(0));
});

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

QUnit.module('Appointment popup form', moduleConfig, () => {
    test('Original appointment\'s fields shouldn\'t fill if used fieldExpr', function(assert) {
        const data = [];
        const textExpValue = 'Subject';

        const scheduler = createScheduler({
            dataSource: data,
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2021, 4, 27),
            textExpr: textExpValue,
            onAppointmentAdded: ({ appointmentData }) => {
                assert.strictEqual(appointmentData[textExpValue], 'qwerty', 'Mapped text property should be fill on onAppointmentAdded event');
                assert.strictEqual(appointmentData.text, undefined, 'Original text property should be undefined on onAppointmentAdded event');
            },
            height: 600
        });
        scheduler.instance.showAppointmentPopup();
        scheduler.appointmentForm.setSubject('qwerty', textExpValue);
        scheduler.appointmentPopup.clickDoneButton();

        assert.strictEqual(data[0].Subject, 'qwerty', 'Mapped text property should be fill');
        assert.strictEqual(data[0].text, undefined, 'Original text property should be undefined');
    });

    QUnit.test('Recurrence form should work properly if recurrenceRule property mapped recurrenceRuleExpr', function(assert) {
        const scheduler = createScheduler({
            dataSource: [{
                text: 'Watercolor Landscape',
                startDate: new Date(2017, 4, 1, 9, 30),
                endDate: new Date(2017, 4, 1, 11),
                customRecurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10'
            }],
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            recurrenceRuleExpr: 'customRecurrenceRule',
            height: 600
        });

        scheduler.appointments.dblclick(0);
        scheduler.appointmentPopup.dialog.clickEditSeries();

        const form = scheduler.instance._appointmentPopup.form.form;

        assert.ok(form.getEditor('repeat').option('value'), 'repeat checkbox should be checked');
        assert.ok(form.option('items')[1].visible, 'recurrence form should be visible');

        scheduler.instance._appointmentPopup.popup.hide();
        scheduler.instance.showAppointmentPopup();

        assert.notOk(form.getEditor('repeat').option('value'), 'repeat checkbox should be unchecked if empty form');
        assert.notOk(form.option('items')[1].visible, 'recurrence form should be invisible if empty form');
    });

    QUnit.test('showAppointmentPopup method should be work properly with no argument', function(assert) {
        const cases = [
            () => {
                const appointmentText = 'app';

                const textEditor = scheduler.appointmentForm.getEditor('text');
                const startDateEditor = scheduler.appointmentForm.getEditor('startDate');
                const endDateEditor = scheduler.appointmentForm.getEditor('endDate');

                textEditor.option('value', appointmentText);
                startDateEditor.option('value', new Date(2017, 4, 22, 9, 30));
                endDateEditor.option('value', new Date(2017, 4, 22, 9, 45));

                scheduler.appointmentPopup.clickDoneButton();

                assert.equal(scheduler.appointments.find(appointmentText).length, 1, 'new appointment should be created with base options');
            },
            () => {
                const appointmentText = 'app';

                const textEditor = scheduler.appointmentForm.getEditor('text');
                const startDateEditor = scheduler.appointmentForm.getEditor('startDate');
                const endDateEditor = scheduler.appointmentForm.getEditor('endDate');


                textEditor.option('value', appointmentText);
                startDateEditor.option('value', new Date(2017, 4, 22, 9, 30));
                endDateEditor.option('value', new Date(2017, 4, 22, 9, 45));

                scheduler.appointmentPopup.clickCancelButton();

                assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'new appointment shouldn\'t created');
            },
            () => {
                const appointmentText = 'all day app';

                const textEditor = scheduler.appointmentForm.getEditor('text');
                const startDateEditor = scheduler.appointmentForm.getEditor('startDate');
                const endDateEditor = scheduler.appointmentForm.getEditor('endDate');
                const visibilityChangedEditor = scheduler.appointmentForm.getEditor('visibilityChanged');

                textEditor.option('value', appointmentText);
                startDateEditor.option('value', new Date(2017, 4, 22, 10, 30));
                endDateEditor.option('value', new Date(2017, 4, 22, 10, 45));
                visibilityChangedEditor.option('value', true);

                scheduler.appointmentPopup.clickDoneButton();

                assert.equal(scheduler.appointments.find(appointmentText).length, 21, 'recurrence appointments should be created');
            }
        ];

        const scheduler = createScheduler();

        cases.forEach(testCase => {
            scheduler.option('dataSource', []);
            scheduler.instance.showAppointmentPopup();

            testCase();
        });
    });

    QUnit.test('Appointment popup form should have two named groups', function(assert) {
        const scheduler = createScheduler({ dataSource: [] });
        const data = {
            text: 'appointment',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
        };

        scheduler.instance.showAppointmentPopup(data);
        const form = scheduler.instance.getAppointmentDetailsForm();

        assert.equal(form.option('items')[0].name, APPOINTMENT_FORM_GROUP_NAMES.Main, 'first group name is correct');
        assert.equal(form.option('items')[1].name, APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'second group name is correct');
    });

    QUnit.test('Appointment popup should be with correct dates after change allDay switch and w/o saving (T832711)', function(assert) {
        const scheduler = createScheduler({ dataSource: [] });
        const data = {
            text: 'all day apo',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            allDay: true
        };

        scheduler.instance.showAppointmentPopup(data);
        const allDayEditor = scheduler.appointmentForm.getEditor('allDay');
        allDayEditor.option('value', false);
        scheduler.appointmentPopup.clickCancelButton();

        scheduler.instance.showAppointmentPopup(data);

        assert.deepEqual(scheduler.appointmentForm.getEditor('startDate').option('value'), data.startDate);
        assert.deepEqual(scheduler.appointmentForm.getEditor('endDate').option('value'), data.endDate);
    });

    QUnit.test('onAppointmentFormOpening event should pass e.popup argument', function(assert) {
        const data = [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const scheduler = createScheduler({
            dataSource: data,
            onAppointmentFormOpening: (e) => {
                assert.equal(e.popup.NAME, 'dxPopup', 'e.popup should be instance of dxPopup');

                e.popup.option('showTitle', true);
                e.popup.option('title', 'Information');
            }
        });

        scheduler.appointments.dblclick();
        assert.equal(scheduler.appointmentPopup.getPopupTitleElement().length, 1, 'title should be visible, after set dxPopup property on onAppointmentFormOpening');
    });

    QUnit.test('onAppointmentFormOpening event should handle e.cancel value', function(assert) {
        const data = [{
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const scheduler = createScheduler({ dataSource: data });

        const testCases = [
            {
                expected: true,
                handler: undefined,
                text: 'appointment popup should visible in default setting case'
            }, {
                expected: false,
                handler: e => e.cancel = true,
                text: 'appointment popup should prevent visible in \'e.cancel = true\' case'
            }, {
                expected: true,
                handler: e => e.cancel = false,
                text: 'appointment popup should visible in \'e.cancel = false\' case'
            }
        ];

        testCases.forEach(({ handler, expected, text }) => {
            scheduler.option('onAppointmentFormOpening', handler);

            scheduler.appointments.dblclick();
            assert.equal(scheduler.appointmentPopup.isVisible(), expected, text + ' if call from UI');
            scheduler.instance._appointmentPopup.popup.option('visible', false);

            scheduler.instance.showAppointmentPopup(data[0]);
            assert.equal(scheduler.appointmentPopup.isVisible(), expected, text + ' if call showAppointmentPopup method');
            scheduler.instance._appointmentPopup.popup.option('visible', false);
        });
    });

    QUnit.test('Appointment popup shouldn\'t render recurrence editor, if previous was with recurrence', function(assert) {
        const scheduler = createScheduler();

        scheduler.appointments.dblclick();
        scheduler.appointmentPopup.dialog.clickEditSeries();

        assert.ok(scheduler.appointmentPopup.form.isRecurrenceEditorVisible(), 'Recurrence editor should visible');
        assert.equal(scheduler.appointmentPopup.form.getSubject(), 'recurrent-app', 'Subject should equal selected recurrence appointment');

        scheduler.appointmentPopup.clickCancelButton();

        scheduler.appointments.dblclick(5);

        assert.notOk(scheduler.appointmentPopup.form.isRecurrenceEditorVisible(), 'Recurrence editor shouldn\'t visible');
        assert.equal(scheduler.appointmentPopup.form.getSubject(), 'common-app', 'Subject in form should equal selected common appointment');
    });

    QUnit.test('Appointment popup should work properly', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const NEW_EXPECTED_SUBJECT = 'NEW SUBJECT';
            const scheduler = createScheduler({}, clock);
            const appointmentPopup = scheduler.appointmentPopup;

            assert.notOk(appointmentPopup.isVisible(), 'Appointment popup should be invisible in on init');

            scheduler.appointments.click(scheduler.appointments.getAppointmentCount() - 1);
            scheduler.tooltip.clickOnItem();
            appointmentPopup.form.setSubject(NEW_EXPECTED_SUBJECT);

            assert.ok(appointmentPopup.isVisible(), 'Appointment popup should be visible after showAppointmentPopup method');
            appointmentPopup.clickDoneButton();

            const dataItem = scheduler.instance.option('dataSource')[1];
            assert.equal(Object.keys(dataItem).length, 3, 'In appointment properties shouldn\'t added excess properties');
            assert.equal(dataItem.text, NEW_EXPECTED_SUBJECT, `Text property of appointment should be changed on ${NEW_EXPECTED_SUBJECT}`);

            scheduler.appointments.click(0);
            scheduler.tooltip.clickOnItem();
            appointmentPopup.dialog.clickEditSeries();

            assert.ok(appointmentPopup.form.isRecurrenceEditorVisible(), 'Recurrence editor should be visible after click on recurrence appointment');
            assert.equal(appointmentPopup.form.getSubject(), defaultData[0].text, 'Subject in form should equal selected appointment');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Recurrence repeat-end editor should have default \'never\' value after reopening appointment popup', function(assert) {
        const firstAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 1' };
        const secondAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 2' };
        const scheduler = createScheduler();

        scheduler.instance.showAppointmentPopup(firstAppointment);

        let form = scheduler.instance.getAppointmentDetailsForm();
        let visibilityChanged = form.getEditor('visibilityChanged');
        visibilityChanged.option('value', true);

        const repeatEndEditor = form.getEditor('recurrenceRule').getEditorByField('repeatEnd');
        repeatEndEditor.option('value', 'count');
        scheduler.appointmentPopup.clickDoneButton();

        scheduler.instance.showAppointmentPopup(secondAppointment);
        form = scheduler.instance.getAppointmentDetailsForm();
        visibilityChanged = form.getEditor('visibilityChanged');
        visibilityChanged.option('value', true);

        assert.strictEqual(repeatEndEditor.option('value'), 'never', 'Repeat-type editor value is ok');
    });

    QUnit.test('Update appointment if CustomStore', function(assert) {
        const done = assert.async();
        const data = [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11)
        }];
        const scheduler = createScheduler({
            views: ['day'],
            dataSource: {
                key: 'id',
                load: () => data,
                update: (key, values) => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            const appointmentData = data.filter(item => item.id === key)[0];
                            $.extend(appointmentData, values);
                            scheduler.instance.repaint();
                            resolve();
                            done();
                        }, 200);
                    });
                },
            },
            currentDate: new Date(2015, 4, 24),
            startDayHour: 8,
            endDayHour: 18
        });

        scheduler.instance.showAppointmentPopup({
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            text: 'Subject'
        });

        scheduler.appointmentForm.setSubject('New Subject');

        const deferred = scheduler.appointmentPopup.saveAppointmentData();

        assert.notOk(scheduler.appointmentPopup.getInstance()._tryLockSaveChanges(), 'Save changes already locked');

        assert.ok(scheduler.appointmentPopup.hasLoadPanel(), 'has load panel');

        deferred.done(() => {
            assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'has no load panel');
            assert.equal(scheduler.appointments.getTitleText(0), 'New Subject', 'Subject is correct');
        });
    });

    QUnit.test('Insert appointment if CustomStore', function(assert) {
        const done = assert.async();
        const data = [];
        const scheduler = createScheduler({
            views: ['day'],
            dataSource: {
                key: 'id',
                load: () => data,
                insert: appointmentData => new Promise(resolve => {
                    setTimeout(() => {
                        appointmentData.id = data.length;
                        data.push(appointmentData);
                        resolve();
                        done();
                    }, 200);
                })
            },
            currentDate: new Date(2015, 4, 24),
            startDayHour: 8,
            endDayHour: 18
        });

        scheduler.instance.showAppointmentPopup();

        scheduler.appointmentForm.setSubject('New Subject');
        scheduler.appointmentForm.setStartDate(new Date(2015, 4, 24, 9));
        scheduler.appointmentForm.setEndDate(new Date(2015, 4, 24, 11));

        const deferred = scheduler.appointmentPopup.saveAppointmentData();

        assert.ok(scheduler.appointmentPopup.hasLoadPanel(), 'has load panel');

        deferred.done(() => {
            assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'has no load panel');
            assert.equal(scheduler.appointments.getTitleText(0), 'New Subject', 'Subject is correct');
        });
    });

    [true, false].forEach(cancel => {
        QUnit.test(`onAppointmentUpdating and e.cancel=${cancel} (T907281)`, function(assert) {
            const data = [{
                startDate: new Date(2015, 4, 24, 9),
                endDate: new Date(2015, 4, 24, 11),
                text: 'Subject'
            }];
            const scheduler = createScheduler({
                views: ['day'],
                dataSource: data,
                currentDate: new Date(2015, 4, 24),
                startDayHour: 8,
                endDayHour: 18,
                onAppointmentUpdating: e => e.cancel = cancel
            });

            scheduler.instance.showAppointmentPopup(data[0]);

            scheduler.appointmentForm.setSubject('New Subject');

            scheduler.appointmentPopup.saveAppointmentData();

            assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'Has no load panel');

            const subject = cancel ? 'Subject' : 'New Subject';
            assert.equal(scheduler.appointments.getTitleText(0), subject, 'Subject is correct');
        });

        QUnit.test(`onAppointmentAdding and e.cancel=${cancel}`, function(assert) {
            const scheduler = createScheduler({
                views: ['day'],
                dataSource: [],
                currentDate: new Date(2015, 4, 24),
                startDayHour: 8,
                endDayHour: 18,
                onAppointmentAdding: e => e.cancel = cancel
            });

            scheduler.instance.showAppointmentPopup();

            scheduler.appointmentForm.setStartDate(new Date(2015, 4, 24, 9));
            scheduler.appointmentForm.setEndDate(new Date(2015, 4, 24, 11));
            scheduler.appointmentForm.setSubject('New Subject');

            scheduler.appointmentPopup.saveAppointmentData();

            assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'Has no load panel');

            const subject = cancel ? '' : 'New Subject';
            assert.equal(scheduler.appointments.getTitleText(0), subject, 'Subject is correct');
        });

        QUnit.test(`onAppointmentDeleting and e.cancel=${cancel}`, function(assert) {
            const clock = sinon.useFakeTimers();
            const data = [{
                text: 'Some Text',
                startDate: new Date(2015, 4, 24, 9),
                endDate: new Date(2015, 4, 24, 11)
            }];
            const scheduler = createScheduler({
                views: ['day'],
                dataSource: data,
                currentDate: new Date(2015, 4, 24),
                startDayHour: 8,
                endDayHour: 18,
                onAppointmentDeleting: e => e.cancel = cancel
            });

            scheduler.instance.deleteAppointment(data[0]);
            clock.tick(10);

            assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'Has no load panel');

            const subject = cancel ? 'Some Text' : '';
            assert.equal(scheduler.appointments.getTitleText(0), subject, 'Subject is correct');

            clock.restore();
        });
    });

    QUnit.module('toolbar', () => {
        [true, false].forEach(allowUpdatingValue => {
            const data = [{
                text: 'Website Re-Design Plan',
                startDate: new Date(2017, 4, 22, 9, 30),
                endDate: new Date(2017, 4, 22, 11, 30),
                disabled: true
            }, {
                text: 'Book Flights to San Fran for Sales Trip',
                startDate: new Date(2017, 4, 22, 12, 0),
                endDate: new Date(2017, 4, 22, 13, 0),
            }];

            QUnit.test(`done button visibility in case allowUpdatingValue = ${allowUpdatingValue}`, function(assert) {
                const scheduler = createWrapper({
                    dataSource: data,
                    views: ['week'],
                    currentView: 'week',
                    currentDate: new Date(2017, 4, 25),
                    editing: {
                        allowUpdating: allowUpdatingValue
                    }
                });

                const assertText = `done button visibility should be equal to = ${allowUpdatingValue}`;
                for(let i = 0; i < scheduler.appointments.getAppointmentCount(); i++) {
                    scheduler.appointments.dblclick(i);
                    assert.equal(scheduler.appointmentPopup.getDoneButton().length > 0, allowUpdatingValue, assertText);
                    scheduler.appointmentPopup.clickCancelButton();
                }
            });
        });

        QUnit.test('toolbar should be re-rendered after change editing option', function(assert) {
            const scheduler = createWrapper({
                dataSource: [],
                views: ['week'],
                currentView: 'week',
                currentDate: new Date(2017, 4, 25),
                editing: {
                    allowUpdating: true
                }
            });

            const dataObj = {
                text: 'a',
                startDate: new Date(2015, 5, 15, 10),
                endDate: new Date(2015, 5, 15, 11)
            };

            scheduler.instance.showAppointmentPopup(dataObj);
            assert.ok(scheduler.appointmentPopup.getDoneButton().length > 0, '"done" button should be visible');

            scheduler.option('editing', {
                allowUpdating: false
            });

            scheduler.instance.showAppointmentPopup(dataObj);
            assert.notOk(scheduler.appointmentPopup.getDoneButton().length > 0, '"done" button shouldn\'t be visible after set allowUpdating option to false');

            scheduler.instance.showAppointmentPopup();
            assert.ok(scheduler.appointmentPopup.getDoneButton().length > 0, '"done" button should be visible in case \'create new appointment\'');
        });
    });
});

if(isDesktopEnvironment()) {
    QUnit.module('Appointment Popup and Recurrence Editor visibility', {
        beforeEach() {
            fx.off = true;
            setWindowWidth(1000);
        },

        afterEach() {
            fx.off = false;
            resetWindowWidth();
        }
    });

    QUnit.test('Recurrence editor container should be visible if recurrence rule was set', function(assert) {
        const scheduler = createScheduler();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a', recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

        checkFormWithRecurrenceEditor(assert, scheduler.instance, true);
    });

    QUnit.test('Recurrence editor container should be visible after changing its visibility value', function(assert) {
        const scheduler = createScheduler();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        checkFormWithRecurrenceEditor(assert, scheduler.instance, false);

        form.getEditor('visibilityChanged').option('value', true);
        checkFormWithRecurrenceEditor(assert, scheduler.instance, true);

        form.getEditor('visibilityChanged').option('value', false);
        checkFormWithRecurrenceEditor(assert, scheduler.instance, false);
    });

    QUnit.test('Popup should show or not show reccurence editor after many opening with different data', function(assert) {
        const scheduler = createScheduler();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a' });
        checkFormWithRecurrenceEditor(assert, scheduler.instance, false);
        scheduler.instance._appointmentPopup.popup.hide();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'b', recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
        checkFormWithRecurrenceEditor(assert, scheduler.instance, true);
        scheduler.instance._appointmentPopup.popup.hide();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'c' });
        checkFormWithRecurrenceEditor(assert, scheduler.instance, false);
    });

    QUnit.test('Popup should show or not to show reccurence editor after many opening with and change visibility', function(assert) {
        const scheduler = createScheduler();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        form.getEditor('visibilityChanged').option('value', true);
        scheduler.instance._appointmentPopup.popup.hide();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'b', recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
        checkFormWithRecurrenceEditor(assert, scheduler.instance, true);
    });

    QUnit.test('Popup should not contain recurrence editor, if recurrenceRuleExpr is null', function(assert) {
        const scheduler = createScheduler();
        const appointment = {
            startDate: new Date(2015, 1, 1, 1),
            endDate: new Date(2015, 1, 1, 2),
            text: 'caption',
            recurrenceRule: 'FREQ=YEARLY'
        };

        scheduler.instance.option('recurrenceRuleExpr', null);
        scheduler.instance.showAppointmentPopup(appointment);

        const form = scheduler.instance.getAppointmentDetailsForm();

        assert.ok(!form.getEditor(null), 'Editor is not rendered');
        assert.equal(scheduler.instance._appointmentPopup.popup.option('maxWidth'), APPOINTMENT_POPUP_WIDTH);
        assert.equal(form.option('items')[0].colSpan, 2, 'colSpan of main group');

        scheduler.instance.option('recurrenceRuleExpr', 'recurrenceRule');

        scheduler.instance.showAppointmentPopup(appointment);
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

        checkFormWithRecurrenceEditor(assert, scheduler.instance, true, APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE, 1);
    });

    QUnit.test('Popup should not contain recurrence editor, if recurrenceRuleExpr is \'\'', function(assert) {
        const scheduler = createScheduler();
        const appointment = {
            startDate: new Date(2015, 1, 1, 1),
            endDate: new Date(2015, 1, 1, 2),
            text: 'caption',
            recurrenceRule: 'FREQ=YEARLY'
        };

        scheduler.instance.option('recurrenceRuleExpr', '');
        scheduler.instance.showAppointmentPopup(appointment);
        const form = scheduler.instance.getAppointmentDetailsForm();

        assert.ok(!form.getEditor(null), 'Editor is not rendered');
        assert.equal(scheduler.instance._appointmentPopup.popup.option('maxWidth'), APPOINTMENT_POPUP_WIDTH);
        assert.equal(form.option('items')[0].colSpan, 2, 'colSpan of main group');
    });

    QUnit.test('Multiple showing appointment popup for recurrence appointments and after update options should work correct', function(assert) {
        const scheduler = createScheduler();
        scheduler.instance.showAppointmentPopup({
            text: 'Appointment 1',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11)
        });

        scheduler.instance.hideAppointmentPopup(true);
        scheduler.instance.option('recurrenceEditMode', 'series');

        scheduler.instance.showAppointmentPopup({
            text: 'Appointment 2',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH'
        });

        checkFormWithRecurrenceEditor(assert, scheduler.instance, true);
    });
}

QUnit.module('Appointment Popup Content', moduleOptions, () => {
    QUnit.test('appointmentPopup should not prevent mouse/touch events by default (T968188)', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        const appointmentPopupOptions = scheduler.instance._appointmentPopup.popup.option();

        assert.strictEqual(appointmentPopupOptions.enableBodyScroll, false, 'enable body scroll');
        assert.strictEqual(appointmentPopupOptions.preventScrollEvents, false, 'prevent scroll events');
    });

    QUnit.test('showAppointmentPopup method with passed a recurrence appointment should render popup(T698732)', function(assert) {
        const appointments = [
            {
                text: 'TEST_TEXT',
                startDate: new Date(2017, 4, 1, 9, 30),
                endDate: new Date(2017, 4, 1, 11),
                recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
            }
        ];

        const scheduler = createInstance({
            dataSource: appointments,
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
        });

        scheduler.instance.showAppointmentPopup(appointments[0], false);

        const popupChoiceAppointmentEdit = $('.dx-popup-normal.dx-resizable').not('.dx-state-invisible');
        assert.equal(popupChoiceAppointmentEdit.length, 1, 'Popup with choice edit mode is rendered');

        popupChoiceAppointmentEdit.find('.dx-popup-bottom .dx-button:eq(1)').trigger('dxclick');
        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Appointment popup is rendered');

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateBox = form.getEditor('startDate');
        const endDateBox = form.getEditor('endDate');

        assert.equal(startDateBox.option('value').valueOf(), appointments[0].startDate.valueOf(), 'Value in start dateBox valid');
        assert.equal(endDateBox.option('value').valueOf(), appointments[0].endDate.valueOf(), 'Value in end dateBox valid');
    });

    QUnit.test('showAppointmentPopup should render a popup only once', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');
    });

    QUnit.test('showAppointmentPopup should work correctly after scheduler repainting', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');
        scheduler.instance.repaint();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');
    });

    QUnit.test('changing editing should work correctly after showing popup', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });
        scheduler.instance.hideAppointmentPopup(true);

        scheduler.instance.option('editing.allowUpdating', false);
        scheduler.instance.option('editing.allowUpdating', true);

        assert.ok(true, 'OK');
    });

    QUnit.test('hideAppointmentPopup should hide a popup', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');
        scheduler.instance.hideAppointmentPopup();
        assert.equal($('.dx-scheduler-appointment-popup').length, 1, 'Popup is hidden');
    });

    QUnit.test('hideAppointmentPopup should hide a popup and save changes', function(assert) {
        const scheduler = createInstance({
            currentDate: new Date(2016, 9, 10),
            currentView: 'month',
        });

        scheduler.instance.showAppointmentPopup({ text: '1', startDate: new Date(2016, 9, 10), endDate: new Date(2016, 9, 11) }, true);

        assert.equal($('.dx-scheduler-appointment-popup').length, 2, 'Popup is rendered');
        scheduler.instance.hideAppointmentPopup(true);
        assert.equal($('.dx-scheduler-appointment-popup').length, 1, 'Popup is hidden');
        assert.equal($('.dx-scheduler-appointment').length, 1, 'appointment is created');
    });

    QUnit.test('showAppointmentPopup should render a popup form only once', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: 'appointment 1' });

        const $form = $('.dx-scheduler-appointment-popup').find('.dx-form').not('.dx-recurrence-editor-container');
        assert.equal($form.length, 1, 'Form was rendered');

        scheduler.instance.hideAppointmentPopup();
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: 'appointment 2' });

        assert.equal($form.find('.dx-textbox').eq(0).dxTextBox('instance').option('text'), 'appointment 2', 'Form data is correct');
    });

    QUnit.test('popup should have right height', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: 'appointment 1' });

        const popup = scheduler.instance._appointmentPopup.popup;

        assert.equal(popup.option('height'), 'auto', 'popup has correct height');
        assert.equal(popup.option('maxHeight'), '100%', 'popup has correct max-height');
    });

    QUnit.test('showAppointmentPopup should render a popup content only once', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: 'appointment 1' });

        const popup = scheduler.instance._appointmentPopup.popup;
        let contentReadyCalled = 0;

        popup.option('onContentReady', function() {
            contentReadyCalled++;
        });
        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), text: 'appointment 2' });

        assert.equal(contentReadyCalled, 0, 'Content wasn\'t rerendered');
    });

    QUnit.test('Popup should contain editors and components with right dx-rtl classes and rtlEnabled option value', function(assert) {
        const scheduler = createWrapper({ rtlEnabled: true });

        scheduler.instance.showAppointmentPopup({});

        const $innerSwitch = $('.dx-scheduler-appointment-popup .dx-switch').eq(0);

        assert.ok($innerSwitch.hasClass('dx-rtl'), 'Inner editor has dx-rtl class');
        assert.equal($innerSwitch.dxSwitch('instance').option('rtlEnabled'), true, 'rtlEnabled option value is right');
    });

    QUnit.test('Popup should contains start datebox with right value', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const $dateBox = $popupContent.find('.dx-datebox').eq(0);

        assert.equal($dateBox.length, 1, 'Start date box is rendered');
        assert.deepEqual($dateBox.dxDateBox('instance').option('value'), new Date(2015, 1, 1, 1), 'value is right');
    });

    QUnit.test('Calendar of the start datebox should have right firstDayOfWeek value', function(assert) {
        if(devices.current().deviceType === 'desktop') {
            const scheduler = createInstance({
                firstDayOfWeek: 4,
            });

            scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

            const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
            const startDateBox = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');

            startDateBox.open();
            const calendar = startDateBox._popup.$content().find('.dx-calendar').dxCalendar('instance');

            assert.equal(calendar.option('firstDayOfWeek'), 4, 'firstDayOfWeek is right');
        } else {
            assert.ok(true, 'It doesn\'t make sense on mobile devices');
        }
    });

    QUnit.test('Popup should contains end datebox with right value', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const $dateBox = $popupContent.find('.dx-datebox').eq(1);

        assert.equal($dateBox.length, 1, 'End datebox is rendered');
        assert.deepEqual($dateBox.dxDateBox('instance').option('value'), new Date(2015, 1, 1, 2), 'value is right');
    });

    QUnit.test('Calendar of the end datebox should have right firstDayOfWeek value', function(assert) {
        if(devices.current().deviceType === 'desktop') {
            const scheduler = createInstance({
                firstDayOfWeek: 4,
            });

            scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

            const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
            const endDateBox = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

            endDateBox.open();
            const calendar = endDateBox._popup.$content().find('.dx-calendar').dxCalendar('instance');

            assert.equal(calendar.option('firstDayOfWeek'), 4, 'firstDayOfWeek is right');
        } else {
            assert.ok(true, 'It doesn\'t make sense on mobile devices');
        }
    });

    QUnit.test('Changing startDateBox value should change endDateBox value if needed', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: 'caption' });
        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateBox = form.getEditor('startDate');
        const endDateBox = form.getEditor('endDate');

        startDateBox.option('value', new Date(2015, 1, 4));

        assert.deepEqual(endDateBox.option('value'), new Date(2015, 1, 6), 'endDate value is right');

        startDateBox.option('value', new Date(2015, 1, 3));

        assert.deepEqual(endDateBox.option('value'), new Date(2015, 1, 6), 'endDate value is right');
    });

    QUnit.test('Changing startDateBox value should change endDateBox value if needed(when startDate and endDate are strings)', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: '1/1/2015', endDate: '1/3/2015', text: 'caption' });
        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateBox = form.getEditor('startDate');
        const endDateBox = form.getEditor('endDate');

        startDateBox.option('value', new Date(2015, 1, 4));

        assert.deepEqual(endDateBox.option('value'), new Date(2015, 1, 6), 'endDate value is right');

        startDateBox.option('value', new Date(2015, 1, 3));

        assert.deepEqual(endDateBox.option('value'), new Date(2015, 1, 6), 'endDate value is right');
    });

    QUnit.test('startDateBox value should be valid', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: 'caption' });
        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateBox = form.getEditor('startDate');

        startDateBox.option('value', undefined);

        assert.deepEqual(startDateBox.option('value'), new Date(2015, 1, 1), 'startDate value is initial value');
    });

    QUnit.test('Changing endDateBox value should change startDateBox value if needed', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 10), endDate: new Date(2015, 1, 13), text: 'caption' });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const startDateBox = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endDateBox = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

        endDateBox.option('value', new Date(2015, 1, 9));

        assert.deepEqual(startDateBox.option('value'), new Date(2015, 1, 6), 'startDate value is right');

        endDateBox.option('value', new Date(2015, 1, 10));

        assert.deepEqual(startDateBox.option('value'), new Date(2015, 1, 6), 'startDate value is right');
    });

    QUnit.test('Changing endDateBox value should change startDateBox value if needed(when startDate and endDate are strings)', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: '1/10/2015', endDate: '1/13/2015', text: 'caption' });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const startDateBox = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endDateBox = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

        endDateBox.option('value', new Date(2015, 0, 9));

        assert.deepEqual(startDateBox.option('value'), new Date(2015, 0, 6), 'startDate value is right');

        endDateBox.option('value', new Date(2015, 0, 10));

        assert.deepEqual(startDateBox.option('value'), new Date(2015, 0, 6), 'startDate value is right');
    });

    QUnit.test('endDateBox value should be valid', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 3), text: 'caption' });
        const form = scheduler.instance.getAppointmentDetailsForm();
        const endDateBox = form.getEditor('endDate');

        endDateBox.option('value', undefined);

        assert.deepEqual(endDateBox.option('value'), new Date(2015, 1, 3), 'endDate value is initial value');
    });

    QUnit.test('Popup should contains caption textbox with right value', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const textBox = form.getEditor('text');

        assert.equal(textBox.$element().length, 1, 'Caption text is rendered');
        assert.equal(textBox.option('value'), 'caption', 'value is right');
    });

    QUnit.test('Confirm dialog should be shown when showAppointmentPopup for recurrence appointment was called', function(assert) {
        const scheduler = createInstance({});

        const startDate = new Date(2015, 1, 1, 1);

        scheduler.instance.showAppointmentPopup({
            startDate: startDate,
            endDate: new Date(2015, 1, 1, 2),
            text: 'caption',
            recurrenceRule: 'FREQ=YEARLY'
        });

        assert.ok($('.dx-dialog').length, 'Dialog was shown');
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
    });

    QUnit.test('Recurrence Editor should have right freq editor value if recurrence rule was set on init', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a', recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

        const form = scheduler.instance.getAppointmentDetailsForm();
        const recurrenceEditor = form.getEditor('recurrenceRule');
        const freqEditor = recurrenceEditor.getEditorByField('freq');

        assert.equal(freqEditor.option('value'), 'weekly', 'value is right');
    });

    QUnit.test('Popup should contain recurrence editor with right config', function(assert) {
        const scheduler = createInstance({
            recurrenceEditMode: 'series',
            firstDayOfWeek: 5,
        });

        const startDate = new Date(2015, 1, 1, 1);

        scheduler.instance.showAppointmentPopup({
            startDate: startDate,
            endDate: new Date(2015, 1, 1, 2),
            text: 'caption',
            recurrenceRule: 'FREQ=YEARLY'
        });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const recurrenceEditor = form.getEditor('recurrenceRule');

        assert.equal(recurrenceEditor.option('value'), 'FREQ=YEARLY', 'value is right');
        assert.deepEqual(recurrenceEditor.option('startDate'), startDate, 'startDate value is right');
        assert.equal(recurrenceEditor.option('firstDayOfWeek'), 5, 'firstDayOfWeek value is right');
    });

    QUnit.test('Recurrence editor should change value if freq editor value changed', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2018, 5, 18), endDate: Date(2018, 5, 18), text: 'a', recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

        const form = scheduler.instance.getAppointmentDetailsForm();
        const recurrenceEditor = form.getEditor('recurrenceRule');
        const freqEditor = recurrenceEditor.getEditorByField('freq');

        freqEditor.option('value', 'daily');

        assert.equal(recurrenceEditor.option('value'), 'FREQ=DAILY', 'recEditor has right value');
    });

    QUnit.test('Recurrence editor should has right startDate after form items change', function(assert) {
        const scheduler = createInstance({
            onAppointmentFormOpening: function(e) {
                const items = e.form.option('items');

                items.push({
                    dataField: 'location',
                    editorType: 'dxTextBox',
                    label: {
                        text: 'Location'
                    }
                });

                e.form.option('items', items);
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2016, 5, 4), endDate: new Date(2016, 5, 5), recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');

        const form = scheduler.instance.getAppointmentDetailsForm();
        const recEditor = form.getEditor('recurrenceRule');

        assert.deepEqual(recEditor.option('startDate'), new Date(2016, 5, 4), 'startDate is ok');
    });

    QUnit.test('Popup should contains description editor', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const descriptionEditor = form.getEditor('description');

        assert.equal(descriptionEditor.$element().length, 1, 'Description editor is rendered');
        assert.equal(descriptionEditor.option('value'), 'First task of this day', 'value is right');
    });

    QUnit.test('Popup should contains allDay editor', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const allDayEditor = form.getEditor('allDay');

        assert.equal(allDayEditor.option('value'), true, 'value is right');
    });

    QUnit.test('allDay changing should switch date & type in editors', function(assert) {
        const scheduler = createInstance({
            startDayHour: 5,
        });

        scheduler.instance.showAppointmentPopup({
            startDate: new Date(2015, 1, 1, 6),
            endDate: new Date(2015, 1, 2, 7), text: 'caption', description: 'First task of this day'
        });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const $allDayEditor = $popupContent.find('.dx-switch').eq(0);
        const allDayEditor = $allDayEditor.dxSwitch('instance');

        allDayEditor.option('value', true);

        const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

        assert.deepEqual(startDate.option('value'), new Date(2015, 1, 1), 'value is right');
        assert.equal(startDate.option('type'), 'date', 'type is right');

        assert.deepEqual(endDate.option('value'), new Date(2015, 1, 1), 'value is right');
        assert.equal(endDate.option('type'), 'date', 'type is right');

        allDayEditor.option('value', false);

        assert.equal(startDate.option('type'), 'datetime', 'type is right after turning off allDay');
        assert.equal(endDate.option('type'), 'datetime', 'type is right after turning off allDay');
        assert.deepEqual(startDate.option('value'), new Date(2015, 1, 1, 5), 'startdate is OK');
        assert.deepEqual(endDate.option('value'), new Date(2015, 1, 1, 5, 30), 'enddate is OK');
    });

    QUnit.test('allDay changing should switch only type in editors, if startDate is undefined', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({
            text: 'test appointment',
            allDay: true
        }, true, null);

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const $allDayEditor = $popupContent.find('.dx-switch').eq(0);
        const allDayEditor = $allDayEditor.dxSwitch('instance');

        allDayEditor.option('value', false);

        const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

        assert.equal(startDate.option('type'), 'datetime', 'type is right');
        assert.equal(endDate.option('type'), 'datetime', 'type is right');
        assert.deepEqual(startDate.option('value'), null, 'value is right');
        assert.deepEqual(endDate.option('value'), null, 'value is right');

        allDayEditor.option('value', true);

        assert.equal(startDate.option('type'), 'date', 'type is right after turning off allDay');
        assert.equal(endDate.option('type'), 'date', 'type is right after turning off allDay');
        assert.deepEqual(startDate.option('value'), null, 'startdate is OK');
        assert.deepEqual(endDate.option('value'), null, 'enddate is OK');
    });

    QUnit.test('There are no exceptions when select date on the appointment popup, startDate > endDate', function(assert) {
        const scheduler = createInstance({});

        const date = new Date();

        scheduler.instance.showAppointmentPopup({
            allDay: true,
            text: '',
            startDate: date,
            endDate: date,
            recurrence: null,
            recurrenceException: null
        });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const dateToTest = new Date();

        dateToTest.setDate(date.getDate() + 5);

        startDate.option('value', dateToTest);

        assert.ok(true, 'There are no exceptions');
    });

    QUnit.test('There are no exceptions when select date on the appointment popup,startDate < endDate', function(assert) {
        const scheduler = createInstance({});

        const date = new Date();

        scheduler.instance.showAppointmentPopup({
            allDay: true,
            text: '',
            startDate: date,
            endDate: date,
            recurrence: null,
            recurrenceException: null
        });

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');
        const dateToTest = new Date();

        dateToTest.setDate(date.getDate() - 5);

        endDate.option('value', dateToTest);

        assert.ok(true, 'There are no exceptions');
    });

    QUnit.test('There are no exceptions when select date on the appointment popup,if dates are undefined', function(assert) {
        const scheduler = createInstance({});

        const date = new Date();

        scheduler.instance.showAppointmentPopup({
            allDay: true,
            text: '',
            recurrence: null,
            recurrenceException: null
        }, true, null);

        const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
        const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
        const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');
        const dateToTest = new Date();

        dateToTest.setDate(date.getDate() - 5);

        startDate.option('value', date);
        endDate.option('value', dateToTest);

        assert.ok(true, 'There are no exceptions');
    });

    QUnit.test('Validate works always before done click', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = createInstance({
            dataSource: data,
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const validation = sinon.stub(form, 'validate');

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        assert.ok(validation.calledOnce);
    });

    QUnit.test('Load panel should not be shown if validation is fail', function(assert) {
        const scheduler = createInstance({
            dataSource: {
                store: this.tasks
            },
            maxAppointmentsPerCell: 2,
            onAppointmentFormOpening: function(data) {
                const form = data.form;

                form.option('items', [{
                    name: 'description',
                    dataField: 'description',
                    editorType: 'dxTextArea',
                    validationRules: [{
                        type: 'required',
                        message: 'Login is required'
                    }]
                }]);
            }
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scheduler.appointmentPopup.hasLoadPanel());
    });

    QUnit.test('Done button default configuration should be correct', function(assert) {
        const scheduler = createInstance({
            onAppointmentFormOpening: function(e) {
                const popup = e.component._appointmentPopup.popup;
                const buttons = popup.option('toolbarItems');
                const doneButton = buttons[0];

                assert.equal(doneButton.options.text, messageLocalization.format('Done'), 'done button text is ok');
            },
            onAppointmentAdding: function(e) {
                e.cancel = true;
            }
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        scheduler.appointmentPopup.clickDoneButton();
    });

    QUnit.test('Done button custom configuration should be correct', function(assert) {
        const scheduler = createInstance({
            dataSource: new DataSource({
                store: this.tasks
            }),
            onAppointmentFormOpening: function(e) {
                const popup = e.component._appointmentPopup.popup;
                const buttons = popup.option('toolbarItems');
                buttons[0].options = { text: 'Text 1' };
                popup.option('toolbarItems', buttons);
            },
            onAppointmentAdding: function(e) {
                e.cancel = true;
            }
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'has no load panel');

        const doneButtonInstance = scheduler.appointmentPopup.getDoneButton().dxButton('instance');
        assert.equal(doneButtonInstance.option('text'), 'Text 1', 'done button text is ok');

        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scheduler.appointmentPopup.isVisible());
    });

    QUnit.test('Load panel should be hidden if event validation fail', function(assert) {
        const scheduler = createInstance({
            dataSource: new DataSource({
                store: this.tasks
            }),
            onAppointmentFormAdding: function(e) {
                e.cancel = true;
            }
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'has no load panel');

        scheduler.appointmentPopup.clickDoneButton();

        assert.notOk(scheduler.appointmentPopup.isVisible());
    });

    QUnit.test('Load panel should be hidden at the second appointment form opening', function(assert) {
        const task = { startDate: new Date(2017, 1, 1), endDate: new Date(2017, 1, 1, 0, 10), text: 'caption' };
        const scheduler = createInstance({
            dataSource: [task]
        });

        scheduler.instance.showAppointmentPopup(task);
        scheduler.appointmentPopup.clickDoneButton();

        scheduler.instance.showAppointmentPopup(task);

        assert.notOk(scheduler.appointmentPopup.hasLoadPanel(), 'has no load panel');
    });

    QUnit.test('startDateBox & endDateBox should have required validation rules', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' });

        const form = scheduler.instance.getAppointmentDetailsForm();

        assert.deepEqual(form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.startDate`).validationRules, [{ type: 'required' }]);
        assert.deepEqual(form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.endDate`).validationRules, [{ type: 'required' }]);
    });

    QUnit.test('Changes shouldn\'t be saved if form is invalid', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = createInstance({
            dataSource: data,
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption' }, true);

        const form = scheduler.instance.getAppointmentDetailsForm();
        const addingAppointment = sinon.stub(scheduler.instance, 'addAppointment');

        sinon.stub(form, 'validate').returns({ isValid: false });

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        assert.notOk(addingAppointment.calledOnce);
    });

    QUnit.test('Appointment popup should contain resources and recurrence editor', function(assert) {
        const rooms = [
            {
                text: 'Room Test',
                id: 4,
            }];

        const scheduler = createInstance({
            resources: [{ label: 'Room', fieldExpr: 'roomId', dataSource: rooms }],
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2), roomId: 4, recurrenceRule: 'FREQ=WEEKLY' });
        $('.dx-dialog-buttons .dx-button').eq(0).trigger('dxclick');
        const form = scheduler.instance.getAppointmentDetailsForm();
        const items = form.option('items');

        assert.equal(items.length, 2, 'Main group and recurrence editor added');
        assert.equal(items[0].items.length, 7, 'Count of editors with resources is correct');
        assert.equal(items[0].items[6].label.text, 'Room', 'Recources is the last element in the main group of editors');
    });
});

QUnit.module('Appointment Popup', moduleOptions, () => {
    QUnit.test('focus is called on popup hiding', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1), endDate: new Date(2015, 1, 2) });

        const spy = sinon.spy(scheduler.instance, 'focus');

        $('.dx-scheduler-appointment-popup .dx-overlay-content .dx-popup-cancel').trigger('dxclick');

        assert.ok(spy.calledOnce, 'focus is called');
    });

    QUnit.test('Multiple showing appointment popup for recurrence appointments should work correctly', function(assert) {
        const scheduler = createInstance({});

        scheduler.instance.showAppointmentPopup({
            text: 'Appointment 1',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11)
        });

        scheduler.instance.hideAppointmentPopup(true);
        scheduler.instance.option('recurrenceEditMode', 'series');

        scheduler.instance.showAppointmentPopup({
            text: 'Appointment 2',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10'
        });

        const popup = scheduler.instance._appointmentPopup.popup;
        const $buttonGroup = $(popup.$content()).find('.dx-buttongroup');

        assert.deepEqual($buttonGroup.eq(0).dxButtonGroup('instance').option('selectedItemKeys'), ['MO', 'TH'], 'Right buttons was checked');
    });

    QUnit.test('Appointment popup will render even if no appointmentData is provided (T734413)', function(assert) {
        const currentDate = new Date(2020, 2, 4);
        const cellDuration = 60;

        const scheduler = createInstance({
            currentDate,
            cellDuration,
        });

        scheduler.instance.showAppointmentPopup({}, true);
        scheduler.instance.hideAppointmentPopup(true);
        scheduler.instance.showAppointmentPopup({}, true);
        const { startDate, endDate } = scheduler.appointmentForm.getFormInstance().option('formData');
        const appointmentPopup = scheduler.appointmentPopup;

        assert.equal(startDate.getTime(), currentDate.getTime(), 'startDate is currentDate in Appointment Form');
        assert.equal(endDate.getTime(), new Date(currentDate.getTime() + cellDuration * toMs('minute')).getTime(), 'endDate is currentDate + cellDuration in Appointment Form');
        assert.ok(appointmentPopup.isVisible(), 'Popup is rendered');

        const $popup = appointmentPopup.getPopup();
        const $startDate = $popup.find('input[name=\'startDate\']')[0];
        const $endDate = $popup.find('input[name=\'endDate\']')[0];

        assert.equal($startDate.value, '2020-03-04T00:00:00', 'startDate is specified');
        assert.equal($endDate.value, '2020-03-04T01:00:00', 'endDate is specified');
    });

    QUnit.test('Appointment popup will render with currentDate on showAppointmentPopup with no arguments', function(assert) {
        const currentDate = new Date(2020, 2, 4);
        const cellDuration = 60;

        const scheduler = createInstance({
            currentDate,
            cellDuration,
        });

        scheduler.instance.showAppointmentPopup();

        const { startDate, endDate } = scheduler.appointmentForm.getFormInstance().option('formData');
        const appointmentPopup = scheduler.appointmentPopup;

        assert.equal(startDate.getTime(), currentDate.getTime(), 'startDate is currentDate in Appointment Form');
        assert.equal(endDate.getTime(), new Date(currentDate.getTime() + cellDuration * toMs('minute')).getTime(), 'endDate is currentDate + cellDuration in Appointment Form');
        assert.ok(appointmentPopup.isVisible(), 'Popup is rendered');

        const $popup = appointmentPopup.getPopup();
        const $startDate = $popup.find('input[name=\'startDate\']')[0];
        const $endDate = $popup.find('input[name=\'endDate\']')[0];

        assert.equal($startDate.value, '2020-03-04T00:00:00', 'startDate is specified');
        assert.equal($endDate.value, '2020-03-04T01:00:00', 'endDate is specified');
    });

    QUnit.test('Appointment form will have right dates on multiple openings (T727713)', function(assert) {
        const appointments = [
            {
                text: 'Appointment1',
                startDate: new Date(2017, 4, 2, 8, 30),
                endDate: new Date(2017, 4, 2, 11),
            }, {
                text: 'Appointment2',
                startDate: new Date(2017, 4, 1, 10),
                endDate: new Date(2017, 4, 1, 11),
            }
        ];

        const scheduler = createInstance({
            dataSource: appointments,
            currentView: 'week',
            views: ['week'],
            currentDate: new Date(2017, 4, 1),
        });

        scheduler.instance.option();
        scheduler.instance.showAppointmentPopup(appointments[1], false);
        let formData = scheduler.appointmentForm.getFormInstance().option('formData');

        assert.deepEqual(formData.startDate, appointments[1].startDate, 'First opening appointment form has right startDate');
        assert.deepEqual(formData.endDate, appointments[1].endDate, 'First opening appointment form has right endDate');

        scheduler.instance.hideAppointmentPopup();

        const form = scheduler.instance.getAppointmentDetailsForm();
        let formDataChangedCount = 0;
        form.option('onOptionChanged', (args) => {
            if(args.name === 'formData') formDataChangedCount++;
        });

        scheduler.appointments.dblclick(0);
        formData = scheduler.appointmentForm.getFormInstance().option('formData');

        assert.deepEqual(formData.startDate, appointments[0].startDate, 'Second opening appointment form has right startDate');
        assert.deepEqual(formData.endDate, appointments[0].endDate, 'Second opening appointment form has right endDate');
        assert.equal(formDataChangedCount, 1, 'Form data changed one time');
    });

    QUnit.test('The vertical scroll bar is shown when an appointment popup fill to a small window\'s height', function(assert) {
        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 1),
            currentView: 'day',
            dataSource: []
        });

        scheduler.instance.showAddAppointmentPopup({
            startDate: new Date(2015, 1, 1),
            endDate: new Date(2015, 1, 1, 1),
            allDay: true
        });

        const popup = scheduler.appointmentPopup;
        popup.setPopupHeight(300);

        assert.ok(popup.hasVerticalScroll(), 'The popup has the vertical scrolling');
    });

    QUnit.test('The resize event of appointment popup is triggered the the window is resize', function(assert) {
        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 1),
            currentView: 'day',
            dataSource: []
        });

        scheduler.instance.showAddAppointmentPopup({
            startDate: new Date(2015, 1, 1),
            endDate: new Date(2015, 1, 1, 1),
            allDay: true
        });

        const $popup = scheduler.appointmentPopup.getPopupInstance().$element();
        let isResizeEventTriggered;
        $($popup).on('dxresize', () => {
            isResizeEventTriggered = true;
        });
        resizeCallbacks.fire();
        assert.ok(isResizeEventTriggered, 'The resize event of popup is triggered');
    });

    QUnit.test('Popup should not be closed until the valid value is typed', function(assert) {
        const startDate = new Date(2015, 1, 1, 1);
        const validValue = 'Test';
        const done = assert.async();
        const scheduler = createInstance({
            onAppointmentFormOpening: function(data) {
                const items = data.form.option('items');
                items[0].items[0].validationRules = [
                    {
                        type: 'async',
                        validationCallback: function(params) {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve(params.value === validValue);
                            }, 10);
                            return d.promise();
                        }
                    }
                ];

                data.form.option('items', items);
            }
        });

        scheduler.instance.showAppointmentPopup({
            startDate: startDate,
            endDate: new Date(2015, 1, 1, 2),
            text: 'caption'
        });

        scheduler.appointmentForm.setSubject('caption1');
        scheduler.appointmentPopup.saveAppointmentData().done(() => {
            assert.equal(scheduler.appointmentForm.getInvalidEditorsCount.call(scheduler), 1, 'the only invalid editor is displayed in the form');

            scheduler.appointmentForm.setSubject(validValue);
            scheduler.appointmentPopup.saveAppointmentData().done(() => {
                assert.notOk(scheduler.appointmentPopup.getPopupInstance().option('visible'), 'the form is closed');

                done();
            });
        });

        assert.equal(scheduler.appointmentForm.getPendingEditorsCount.call(scheduler), 1, 'the only pending editor is displayed in the form');
    });
});

module('Timezone Editors', moduleOptions, () => {
    test('Popup should not contain startDateTimeZone editor by default', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');

        assert.notOk(startDateTimezoneEditor, 'StartDateTZ editor isn\'t visible by default');
    });

    test('Popup should not contain endDateTimeZone editor by default', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const endDateTimeZoneEditor = form.getEditor('endDateTimeZone');

        assert.notOk(endDateTimeZoneEditor, 'EndDateTZ editor isn\'t visible by default');
    });

    test('It should be possible to render startDateTimeZone editor on appt form', function(assert) {
        const scheduler = createInstance({
            onAppointmentFormOpening: function(e) {
                e.form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.startDateTimeZone`, { visible: true });
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');

        assert.ok(startDateTimezoneEditor instanceof SelectBox, 'Editor is SelectBox');
        assert.equal(startDateTimezoneEditor.option('value'), null, 'Value is correct');
    });

    test('It should be possible to render endDateTimeZone editor on appt form', function(assert) {
        const scheduler = createInstance({
            onAppointmentFormOpening: function(e) {
                e.form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.endDateTimeZone`, { visible: true });
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone');

        assert.ok(endDateTimezoneEditor instanceof SelectBox, 'Editor is SelectBox');
        assert.equal(endDateTimezoneEditor.option('value'), null, 'Value is correct');
    });

    test('timeZone editors should have correct options', function(assert) {
        const scheduler = createInstance({
            onAppointmentFormOpening: function(e) {
                e.form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.startDateTimeZone`, { visible: true });
                e.form.itemOption(`${APPOINTMENT_FORM_GROUP_NAMES.Main}.endDateTimeZone`, { visible: true });
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: 'caption', description: 'First task of this day', allDay: true });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('startDateTimeZone');

        [startDateTimezoneEditor, endDateTimezoneEditor].forEach(editor => {
            assert.equal(editor.option('displayExpr'), 'title', 'displayExpr is correct');
            assert.equal(editor.option('valueExpr'), 'id', 'valueExpr is correct');
            assert.strictEqual(editor.option('searchEnabled'), true, 'searchEnabled is correct');
            assert.equal(editor.option('placeholder'), 'No timezone', 'placeholder is correct');

            assert.ok(editor.option('dataSource') instanceof DataSource, 'editor has dataSource');
            assert.equal(editor.option('dataSource')._paginate, true, 'paging is enabled');
            assert.equal(editor.option('dataSource')._pageSize, 10, 'pageSize is correct');
        });
    });

    QUnit.test('timeZone editors should have correct value & display value on init', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), startDateTimeZone: 'Europe/Paris', endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('startDateTimeZone');

        [startDateTimezoneEditor, endDateTimezoneEditor].forEach(editor => {
            assert.equal(editor.option('value'), 'Europe/Paris', 'value is ok');
            assert.equal(editor.option('displayValue'), '(GMT +01:00) Europe - Paris', 'displayValue is ok');
        });
    });

    QUnit.test('timeZone editor should have correct display value for timezones with different offsets ', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');

        startDateTimezoneEditor.option('value', 'Etc/UTC');
        assert.equal(startDateTimezoneEditor.option('displayValue'), '(GMT +00:00) Etc - UTC', 'displayValue is ok');
        startDateTimezoneEditor.option('value', 'America/Los_Angeles');
        assert.equal(startDateTimezoneEditor.option('displayValue'), '(GMT -08:00) America - Los Angeles', 'displayValue is ok');
    });

    QUnit.test('timeZone editor display value for timeZone with DST should depend on date', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), startDateTimeZone: 'Europe/Paris', endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        let form = scheduler.instance.getAppointmentDetailsForm();
        let startDateTimezoneEditor = form.getEditor('startDateTimeZone');

        assert.equal(startDateTimezoneEditor.option('displayValue'), '(GMT +01:00) Europe - Paris', 'displayValue is ok');
        scheduler.instance._appointmentPopup.popup.hide();

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 5, 1, 1), startDateTimeZone: 'Europe/Paris', endDate: new Date(2020, 5, 1, 2), text: 'test_text' });

        form = scheduler.instance.getAppointmentDetailsForm();
        startDateTimezoneEditor = form.getEditor('startDateTimeZone');

        assert.equal(startDateTimezoneEditor.option('displayValue'), '(GMT +02:00) Europe - Paris', 'displayValue is ok, DST');
    });

    QUnit.test('dataSource of timezoneEditor should be filtered', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
            onAppointmentFormOpening: function(e) {
                const startDateTimezoneEditor = e.form.getEditor('startDateTimeZone');
                const dataSource = startDateTimezoneEditor.option('dataSource');
                dataSource.paginate(false);
                dataSource.filter(['id', 'contains', 'Pacific']);
                startDateTimezoneEditor.option('opened', true);
            }
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), endDate: new Date(2020, 1, 1, 2), text: 'test_text' });
        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const expectedItemCount = 45; // US/Pacific-New is excluded
        assert.equal(startDateTimezoneEditor.option('items').length, expectedItemCount, 'Items are filtered');

    });

    test('startDateTimeZone and endDateTimeZone editor should be rendered with allowTimeZoneEditing option', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone');

        assert.ok(startDateTimezoneEditor.option('visible'), 'startDateTimeZone editor is visible');
        assert.ok(endDateTimezoneEditor.option('visible'), 'endDateTimeZone editor is visible');

        assert.equal(startDateTimezoneEditor.option('value'), null, 'startDateTimeZone editor value should be null');
        assert.equal(endDateTimezoneEditor.option('value'), null, 'endDateTimeZone editor value should be null');
    });

    test('Change value in startDateTimeZone editor should trigger change value in endDateTimeZone editor if allowTimeZoneEditing: true', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone');

        startDateTimezoneEditor.option('value', 'Africa/Cairo');

        assert.equal(startDateTimezoneEditor.option('value'), 'Africa/Cairo', 'startDateTimeZone editor value should be "Africa/Cairo"');
        assert.equal(endDateTimezoneEditor.option('value'), 'Africa/Cairo', 'endDateTimeZone editor value should be "Africa/Cairo"');
    });

    test('Change value in endDateTimeZone editor shouldn\'t trigger change value in startDateTimeZone editor if allowTimeZoneEditing: true', function(assert) {
        const scheduler = createInstance({
            editing: {
                allowTimeZoneEditing: true,
            },
        });

        scheduler.instance.showAppointmentPopup({ startDate: new Date(2020, 1, 1, 1), endDate: new Date(2020, 1, 1, 2), text: 'test_text' });

        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone');

        startDateTimezoneEditor.option('value', 'Asia/Pyongyang');
        endDateTimezoneEditor.option('value', 'Africa/Cairo');

        assert.equal(startDateTimezoneEditor.option('value'), 'Asia/Pyongyang', 'startDateTimeZone editor value should be "Africa/Cairo"');
        assert.equal(endDateTimezoneEditor.option('value'), 'Africa/Cairo', 'endDateTimeZone editor value should be "Africa/Cairo"');
    });
});
