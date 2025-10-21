import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type dxDateBox from '@js/ui/date_box';
import { toMilliseconds } from '@ts/utils/toMilliseconds';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from '../__tests__/__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from '../__tests__/__mock__/m_mock_scheduler';

const getDefaultData = () => [
  {
    text: 'recurrent-app',
    startDate: new Date(2017, 4, 1, 9, 30),
    endDate: new Date(2017, 4, 1, 11),
    recurrenceRule: 'FREQ=DAILY;COUNT=5',
  }, {
    text: 'common-app',
    startDate: new Date(2017, 4, 9, 9, 30),
    endDate: new Date(2017, 4, 9, 11),
  }, {
    text: 'disabled-app',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
    disabled: true,
  }, {
    text: 'all-day-app',
    startDate: new Date(2017, 4, 1),
    endDate: new Date(2017, 4, 1),
    allDay: true,
  },
];

const commonAppointment = getDefaultData()[1];
const allDayAppointment = getDefaultData()[3];

const getDefaultConfig = () => ({
  dataSource: getDefaultData(),
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
  firstDayOfWeek: 1,
  startDayHour: 9,
  height: 600,
  width: 600,
});

describe('Appointment Popup Form', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  describe('Appointment changes saving/canceling', () => {
    it.each([
      'startDate', 'startTime', 'endDate', 'endTime',
    ])('should not close popup on save button click when %s is empty', async (field) => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      let fieldEditorElement: Element | null = null;
      if (field === 'startDate') { fieldEditorElement = POM.popup.startDate; }
      if (field === 'startTime') { fieldEditorElement = POM.popup.startTime; }
      if (field === 'endDate') { fieldEditorElement = POM.popup.endDate; }
      if (field === 'endTime') { fieldEditorElement = POM.popup.endTime; }

      // @ts-expect-error
      const dateBox = $(fieldEditorElement).dxDateBox('instance') as dxDateBox;

      dateBox.option('value', null);

      POM.popup.getSaveButton().click();

      expect(POM.popup.component.option('visible')).toBe(true);
    });

    it('should save data to appointment after save button was clicked', async () => {
      setupSchedulerTestEnvironment({ height: 200 });
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      POM.openPopupByDblClick('common-app');
      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      POM.popup.getSaveButton().click();

      const dataItem = scheduler.option('dataSource')?.[1];

      expect(dataItem).toMatchObject({
        ...commonAppointment,
        text: 'New Subject',
      });
    });

    it('should not update appointment if popup was closed by cancel button', async () => {
      setupSchedulerTestEnvironment({ height: 200 });
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      POM.openPopupByDblClick('common-app');
      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      POM.popup.getCancelButton().click();

      const dataItem = scheduler.option('dataSource')?.[1];
      expect(dataItem).toMatchObject({ ...commonAppointment });
    });
  });

  describe('Toolbar', () => {
    it.each([
      { allowUpdating: false, disabled: false },
      { allowUpdating: false, disabled: true },
      { allowUpdating: true, disabled: false },
      { allowUpdating: true, disabled: true },
    ])('Buttons visibility when %p', async ({ allowUpdating, disabled }) => {
      setupSchedulerTestEnvironment({ height: 200 });
      const shouldHaveSaveButton = allowUpdating;

      const { POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating },
      });

      POM.openPopupByDblClick(disabled ? 'disabled-app' : 'common-app');

      if (shouldHaveSaveButton) {
        expect(POM.popup.component.option('toolbarItems')).toMatchObject([
          { shortcut: 'done' },
          { shortcut: 'cancel' },
        ]);
      } else {
        expect(POM.popup.component.option('toolbarItems')).toMatchObject([
          { shortcut: 'cancel' },
        ]);
      }
    });

    it('Buttons visibility after editing option changed', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowAdding: true,
        },
      });

      const newAppointment = {
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11),
      };

      scheduler.showAppointmentPopup(newAppointment);
      expect(POM.popup.component.option('toolbarItems')).toMatchObject([
        { shortcut: 'done' },
        { shortcut: 'cancel' },
      ]);

      scheduler.option('editing', { allowUpdating: false });
      scheduler.showAppointmentPopup(newAppointment);
      expect(POM.popup.component.option('toolbarItems')).toMatchObject([
        { shortcut: 'cancel' },
      ]);

      scheduler.showAppointmentPopup();
      expect(POM.popup.component.option('toolbarItems')).toMatchObject([
        { shortcut: 'done' },
        { shortcut: 'cancel' },
      ]);
    });
  });

  describe('allDay switch', () => {
    it('should be turned on when opening allDay appointment', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(allDayAppointment);

      expect(POM.popup.getSwitchByName('allDay').value).toBe('true');
    });

    it('should be turned off when opening non-allDay appointment', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.getSwitchByName('allDay').value).toBe('false');
    });

    it('should hide time editors when switched on', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.startDate).toBeDefined();
      expect(POM.popup.startTime).toBeDefined();
      expect(POM.popup.endDate).toBeDefined();
      expect(POM.popup.endTime).toBeDefined();

      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.startDate).toBeDefined();
      expect(POM.popup.startTime).toBeNull();
      expect(POM.popup.endDate).toBeDefined();
      expect(POM.popup.endTime).toBeNull();
    });

    it('should show time editors when switched off', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(allDayAppointment);

      expect(POM.popup.startDate).toBeDefined();
      expect(POM.popup.startTime).toBeNull();
      expect(POM.popup.endDate).toBeDefined();
      expect(POM.popup.endTime).toBeNull();

      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.startDate).toBeDefined();
      expect(POM.popup.startTime).toBeDefined();
      expect(POM.popup.endDate).toBeDefined();
      expect(POM.popup.endTime).toBeDefined();
    });

    it.each(['day', 'week', 'month'])('should set correct dates when switching on then off in %p view', async (view) => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: view,
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getSwitchByName('allDay').click();

      const expectedStartDate = new Date(commonAppointment.startDate);
      expectedStartDate.setHours(scheduler.option('startDayHour'), 0, 0, 0);

      let expectedEndDate: Date | null = null;

      if (view === 'month') {
        expectedEndDate = new Date(expectedStartDate);
        expectedEndDate.setHours(scheduler.option('endDayHour'), 0, 0, 0);
      }
      if (view === 'week' || view === 'day') {
        const cellDuration = scheduler.option('cellDuration') * toMilliseconds('minute');
        expectedEndDate = new Date(expectedStartDate.getTime() + cellDuration);
      }

      expect(POM.popup.form.option('formData')).toMatchObject({
        startDate: expectedStartDate,
        endDate: expectedEndDate,
      });
    });

    it('should show correct dates after switching on allDay and canceling changes (T832711)', async () => {
      const { scheduler, POM } = await createScheduler(undefined);

      const data = {
        text: 'all day apo',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        allDay: true,
      };

      scheduler.showAppointmentPopup(data);

      POM.popup.getSwitchByName('allDay').click();

      POM.popup.getCancelButton().click();

      scheduler.showAppointmentPopup(data);

      const { value: startDateValue } = POM.popup.getInputByLabel('Start Date');
      const { value: endDateValue } = POM.popup.getInputByLabel('End Date');

      expect(startDateValue).toBe('5/1/2017');
      expect(endDateValue).toBe('5/1/2017');
    });
  });

  describe('Timezones', () => {
    it('should have correct values on popup open', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });
      scheduler.showAppointmentPopup({
        ...commonAppointment,
        startDateTimeZone: 'America/Los_Angeles',
        endDateTimeZone: 'America/New_York',
      });

      // @ts-expect-error
      const startTimeZoneSelectBox = $(POM.popup.startTimeZone).dxSelectBox('instance');
      // @ts-expect-error
      const endTimeZoneSelectBox = $(POM.popup.endTimeZone).dxSelectBox('instance');

      expect(startTimeZoneSelectBox.option('value')).toBe('America/Los_Angeles');
      expect(endTimeZoneSelectBox.option('value')).toBe('America/New_York');
    });

    it('should be shown when editing.allowTimeZoneEditing is true', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.startTimeZone).toBeDefined();
      expect(POM.popup.endTimeZone).toBeDefined();
    });

    it('should be hidden when editing.allowTimeZoneEditing is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: false },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.startTimeZone).toBeNull();
      expect(POM.popup.endTimeZone).toBeNull();
    });

    it('change of startTimeZone value should trigger endTimeZone value change', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      // @ts-expect-error
      const startTimeZoneSelectBox = $(POM.popup.startTimeZone).dxSelectBox('instance');
      // @ts-expect-error
      const endTimeZoneSelectBox = $(POM.popup.endTimeZone).dxSelectBox('instance');

      startTimeZoneSelectBox.option('value', 'America/Los_Angeles');

      expect(startTimeZoneSelectBox.option('value')).toBe('America/Los_Angeles');
      expect(endTimeZoneSelectBox.option('value')).toBe('America/Los_Angeles');
    });

    it('change of endTimeZone value should not trigger startTimeZone value change', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      // @ts-expect-error
      const startTimeZoneSelectBox = $(POM.popup.startTimeZone).dxSelectBox('instance');
      // @ts-expect-error
      const endTimeZoneSelectBox = $(POM.popup.endTimeZone).dxSelectBox('instance');

      startTimeZoneSelectBox.option('value', 'America/Los_Angeles');
      endTimeZoneSelectBox.option('value', 'America/New_York');

      expect(startTimeZoneSelectBox.option('value')).toBe('America/Los_Angeles');
      expect(endTimeZoneSelectBox.option('value')).toBe('America/New_York');
    });
  });

  describe('Recurrence', () => {
    it('Recurrence form should work properly if recurrenceRule property mapped recurrenceRuleExpr', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Watercolor Landscape',
          startDate: new Date(2017, 4, 1, 9, 30),
          endDate: new Date(2017, 4, 1, 11),
          customRecurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10',
        }],
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2017, 4, 25),
        recurrenceRuleExpr: 'customRecurrenceRule',
        height: 600,
      });

      POM.openPopupByDblClick();

      POM.popup.getEditSeriesButton().click();

      // @ts-expect-error
      const repeatEditorBeforeRecurrenceForm = $(POM.popup.repeatEditor).dxSelectBox('instance');
      expect(repeatEditorBeforeRecurrenceForm.option('value')).toBe('weekly');
    });

    it('Repeat editor should have value "never" if previous appointment was recurrent', async () => {
      setupSchedulerTestEnvironment({ height: 200 });
      const { POM, scheduler } = await createScheduler({
        dataSource: [{
          text: 'recurrent-app',
          startDate: new Date(2017, 4, 1, 9, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=DAILY;COUNT=5',
        }, {
          text: 'common-app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
        }],
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2017, 4, 25),
        firstDayOfWeek: 1,
        startDayHour: 9,
      });

      POM.openPopupByDblClick('recurrent-app');

      POM.popup.getEditSeriesButton().click();

      // @ts-expect-error
      const repeatEditorRecurrent = $(POM.popup.repeatEditor).dxSelectBox('instance');
      const buttonsRecurrent = repeatEditorRecurrent.option('buttons');
      const hasSettingsButtonRecurrent = buttonsRecurrent?.some((btn) => btn.name === 'settings');

      expect(repeatEditorRecurrent.option('value')).toBe('daily');
      expect(hasSettingsButtonRecurrent).toBe(true);

      scheduler.hideAppointmentPopup();

      POM.openPopupByDblClick('common-app');

      // @ts-expect-error
      const repeatEditorCommon = $(POM.popup.repeatEditor).dxSelectBox('instance');
      const buttonsCommon = repeatEditorCommon.option('buttons');
      const hasSettingsButtonCommon = buttonsCommon?.some((btn) => btn.name === 'settings');

      expect(repeatEditorCommon.option('value')).toBe('never');
      expect(hasSettingsButtonCommon).toBe(false);
    });

    it('Recurrence repeat-end editor should have default \'never\' value after reopening appointment popup', async () => {
      const firstAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 1' };
      const secondAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 2' };
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(firstAppointment);

      // @ts-expect-error
      const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
      repeatEditor.option('value', 'weekly');

      scheduler.hideAppointmentPopup();

      scheduler.showAppointmentPopup(secondAppointment);

      // @ts-expect-error
      const repeatEditorSecond = $(POM.popup.repeatEditor).dxSelectBox('instance');
      const value = repeatEditorSecond.option('value');

      expect(value).toBe('never');
    });

    it('Recurrence editor container should be visible after changing its visibility value', async () => {
      const appointment = {
        text: 'Test Appointment',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
      };

      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(appointment);

      const recurrenceGroup = $(POM.popup.recurrenceGroup);

      expect(recurrenceGroup.hasClass('dx-scheduler-form-recurrence-hidden')).toBe(true);

      // @ts-expect-error
      const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
      repeatEditor.option('value', 'weekly');

      expect(recurrenceGroup.hasClass('dx-scheduler-form-recurrence-hidden')).toBe(false);
    });

    it('Should discard recurrence changes when clicking \'cancel\' button in recurrence form', async () => {
      const data = [
        {
          text: 'meet',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        },
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: data,
        currentDate: new Date(2017, 4, 22),
      });

      POM.openPopupByDblClick('meet');

      // @ts-expect-error
      const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
      repeatEditor.option('value', 'weekly');

      scheduler.hideAppointmentPopup(true);

      POM.openPopupByDblClick('meet');

      POM.popup.getEditSeriesButton().click();

      // @ts-expect-error
      const repeatEditor2 = $(POM.popup.repeatEditor).dxSelectBox('instance');
      repeatEditor2.option('value', 'daily');

      POM.popup.getBackButton().click();

      scheduler.hideAppointmentPopup();

      POM.openPopupByDblClick('meet');

      POM.popup.getEditSeriesButton().click();

      // @ts-expect-error
      const repeatEditor3 = $(POM.popup.repeatEditor).dxSelectBox('instance');
      expect(repeatEditor3.option('value')).toBe('weekly');
    });

    describe('Recurrence frequency types', () => {
      it('Should show day selection buttons when frequency is weekly', async () => {
        const appointment = {
          text: 'Test Appointment',
          startDate: new Date(2017, 4, 1, 9, 30),
          endDate: new Date(2017, 4, 1, 11),
        };

        const { POM, scheduler } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(appointment);

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'weekly');

        POM.popup.openRecurrenceSettings();

        const dayButtons = $(POM.popup.recurrenceWeekDayButtons);
        expect(dayButtons.length).toBeGreaterThan(0);

        const buttons7Days = dayButtons.find('.dx-button');
        expect(buttons7Days.length).toBe(7);
      });

      it('Should show month day input when frequency is monthly', async () => {
        const appointment = {
          text: 'Test Appointment',
          startDate: new Date(2017, 4, 15, 9, 30),
          endDate: new Date(2017, 4, 15, 11),
        };

        const { POM, scheduler } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(appointment);

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'monthly');

        POM.popup.openRecurrenceSettings();

        const monthlyGroup = POM.popup.recurrenceMonthlyGroup;
        expect(monthlyGroup).toBeTruthy();

        // @ts-expect-error
        const freqEditor = $(POM.popup.freqEditor).dxSelectBox('instance');
        expect(freqEditor.option('value')).toBe('monthly');

        const dayButtons = POM.popup.recurrenceWeekDayButtons;
        expect(dayButtons).toBeNull();
      });

      it('Should show month and day inputs when frequency is yearly', async () => {
        const appointment = {
          text: 'Test Appointment',
          startDate: new Date(2017, 11, 25, 9, 30),
          endDate: new Date(2017, 11, 25, 11),
        };

        const { POM, scheduler } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(appointment);

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'yearly');

        POM.popup.openRecurrenceSettings();

        const yearlyGroup = POM.popup.recurrenceYearlyGroup;
        expect(yearlyGroup).toBeTruthy();

        // eslint-disable-next-line spellcheck/spell-checker
        const bymonthEditor = POM.popup.getSwitchByName('bymonth');
        // eslint-disable-next-line spellcheck/spell-checker
        expect(bymonthEditor).toBeDefined();

        // eslint-disable-next-line spellcheck/spell-checker
        const bymonthdayEditor = POM.popup.getSwitchByName('bymonthday');
        // eslint-disable-next-line spellcheck/spell-checker
        expect(bymonthdayEditor).toBeDefined();

        const freqEditor = POM.popup.getSwitchByName('freq');
        expect(freqEditor.value).toBe('yearly');
      });

      it('Should hide all repeat-on options for daily frequency', async () => {
        const appointment = {
          text: 'Test Appointment',
          startDate: new Date(2017, 4, 1, 9, 30),
          endDate: new Date(2017, 4, 1, 11),
        };

        const { POM, scheduler } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(appointment);

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'daily');

        POM.popup.openRecurrenceSettings();

        const freqEditor = POM.popup.getSwitchByName('freq');
        expect(freqEditor.value).toBe('daily');

        const dayButtons = POM.popup.recurrenceWeekDayButtons;
        expect(dayButtons).toBeNull();

        const monthlyGroup = POM.popup.recurrenceMonthlyGroup;
        expect(monthlyGroup).toBeNull();

        const yearlyGroup = POM.popup.recurrenceYearlyGroup;
        expect(yearlyGroup).toBeNull();
      });

      it('Should hide all repeat-on options for hourly frequency', async () => {
        const appointment = {
          text: 'Test Appointment',
          startDate: new Date(2017, 4, 1, 9, 30),
          endDate: new Date(2017, 4, 1, 11),
        };

        const { POM, scheduler } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(appointment);

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'hourly');

        POM.popup.openRecurrenceSettings();

        // @ts-expect-error
        const freqEditor = $(POM.popup.freqEditor).dxSelectBox('instance');
        expect(freqEditor.option('value')).toBe('hourly');

        const dayButtons = POM.popup.recurrenceWeekDayButtons;
        expect(dayButtons).toBeNull();

        const monthlyGroup = POM.popup.recurrenceMonthlyGroup;
        expect(monthlyGroup).toBeNull();

        const yearlyGroup = POM.popup.recurrenceYearlyGroup;
        expect(yearlyGroup).toBeNull();
      });
    });

    describe('Editing and saving recurrence', () => {
      it('Should populate form with existing weekly recurrence rule', async () => {
        setupSchedulerTestEnvironment({ height: 200 });
        const { POM } = await createScheduler({
          dataSource: [{
            text: 'Weekly Meeting',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
            repeatEnd: 'count',
          }],
          views: ['month'],
          currentView: 'month',
          currentDate: new Date(2017, 4, 25),
          firstDayOfWeek: 1,
          startDayHour: 9,
        });

        POM.openPopupByDblClick('Weekly Meeting');

        POM.popup.getEditSeriesButton().click();

        // @ts-expect-error
        const repeatEditorRecurrent = $(POM.popup.repeatEditor).dxSelectBox('instance');

        expect(repeatEditorRecurrent.option('value')).toBe('weekly');

        POM.popup.openRecurrenceSettings();

        // @ts-expect-error
        const freqEditor = $(POM.popup.freqEditor).dxSelectBox('instance');
        expect(freqEditor.option('value')).toBe('weekly');

        const dayButtons = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
        const selectedButtons = dayButtons.filter('.dx-button-mode-contained');
        expect(selectedButtons.length).toBe(3);

        const repeatEndEditor = POM.popup.getSwitchByName('repeatEnd');
        expect(repeatEndEditor.value).toBe('count');

        const countEditor = POM.popup.getSwitchByName('count');
        expect(countEditor.value).toBe('10');
      });

      it('Should save changes when saving from recurrence form', async () => {
        const data = [
          {
            text: 'Meeting',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30),
          },
        ];

        const { POM, scheduler } = await createScheduler({
          dataSource: data,
          currentDate: new Date(2017, 4, 22),
        });

        POM.openPopupByDblClick('Meeting');

        // @ts-expect-error
        const repeatEditor = $(POM.popup.repeatEditor).dxSelectBox('instance');
        repeatEditor.option('value', 'daily');

        POM.popup.openRecurrenceSettings();

        // @ts-expect-error
        const freqEditor = $(POM.popup.freqEditor).dxSelectBox('instance');
        freqEditor.option('value', 'weekly');

        POM.popup.getBackButton().click();

        scheduler.hideAppointmentPopup(true);

        POM.openPopupByDblClick('Meeting');

        POM.popup.getEditSeriesButton().click();

        // @ts-expect-error
        const freqEditorAfter = $(POM.popup.freqEditor).dxSelectBox('instance');
        expect(freqEditorAfter.option('value')).toBe('weekly');

        // @ts-expect-error
        const repeatEditorAfter = $(POM.popup.repeatEditor).dxSelectBox('instance');
        expect(repeatEditorAfter.option('value')).toBe('weekly');
      });
    });
  });

  describe('Callbacks', () => {
    describe('OnAppointmentFormOpening', () => {
      it('should pass e.popup argument', async () => {
        const data = [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }];

        const onAppointmentFormOpening = jest.fn((e:
        { popup: { option: (key: string, value: unknown) => void } }) => {
          e.popup.option('showTitle', true);
          e.popup.option('title', 'Information');
        });

        const { POM } = await createScheduler({
          dataSource: data,
          onAppointmentFormOpening,
          currentDate: new Date(2017, 4, 22),
        });

        POM.openPopupByDblClick('Website Re-Design Plan');

        expect(POM.popup.getTitle()?.textContent).toBe('Information');
      });

      it('should handle e.cancel value: default settings', async () => {
        const data = [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }];

        const { POM, scheduler } = await createScheduler({
          dataSource: data,
          currentDate: new Date(2017, 4, 22),
        });

        POM.openPopupByDblClick('Website Re-Design Plan');

        const popup = POM.getPopups();
        expect(popup.length).toBe(1);

        POM.popup.getCancelButton().click();

        scheduler.showAppointmentPopup(data[0]);

        expect(POM.getPopups().length).toBe(1);
      });

      it('should handle e.cancel value: true', async () => {
        const data = [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }];

        const onAppointmentFormOpening = jest.fn((e: { cancel: boolean }) => {
          e.cancel = true;
        });

        const { POM, scheduler } = await createScheduler({
          dataSource: data,
          onAppointmentFormOpening,
          currentDate: new Date(2017, 4, 22),
        });

        POM.openPopupByDblClick('Website Re-Design Plan');

        expect(POM.getPopups().length).toBe(0);

        scheduler.showAppointmentPopup(data[0]);

        expect(POM.getPopups().length).toBe(0);
      });

      it('should handle e.cancel value: false', async () => {
        const data = [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }];

        const onAppointmentFormOpening = jest.fn((e: { cancel: boolean }) => {
          e.cancel = false;
        });

        const { POM, scheduler } = await createScheduler({
          dataSource: data,
          onAppointmentFormOpening,
          currentDate: new Date(2017, 4, 22),
        });

        POM.openPopupByDblClick('Website Re-Design Plan');

        expect(POM.getPopups().length).toBe(1);

        POM.popup.getCancelButton().click();

        scheduler.showAppointmentPopup(data[0]);

        expect(POM.getPopups().length).toBe(1);
      });
    });

    describe('onAppointmentAdding', () => {
      it('should handle e.cancel value: true', async () => {
        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: [],
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentAdding: (e: { cancel: boolean }) => { e.cancel = true; },
        });

        scheduler.showAppointmentPopup();

        POM.popup.form.option('formData', {
          startDate: new Date(2015, 4, 24, 9, 0),
          endDate: new Date(2015, 4, 24, 11, 0),
          text: 'New Subject',
        });

        POM.popup.getSaveButton().click();

        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        await new Promise(process.nextTick);

        const appointments = POM.getAppointments();

        expect(appointments.length).toBe(0);
      });

      it('should handle e.cancel value: false', async () => {
        setupSchedulerTestEnvironment({ height: 200 });
        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: [],
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentAdding: (e: { cancel: boolean }) => { e.cancel = false; },
        });

        scheduler.showAppointmentPopup();

        POM.popup.form.option('formData', {
          startDate: new Date(2015, 4, 24, 9, 0),
          endDate: new Date(2015, 4, 24, 11, 0),
          text: 'New Subject',
        });

        POM.popup.getSaveButton().click();

        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        await new Promise(process.nextTick);

        expect(POM.getAppointment('New Subject').getText()).toEqual('New Subject');
      });
    });

    describe('onAppointmentUpdating', () => {
      it('onAppointmentUpdating and e.cancel=true (T907281)', async () => {
        const data = [{
          startDate: new Date(2015, 4, 24, 9),
          endDate: new Date(2015, 4, 24, 11),
          text: 'Subject',
        }];
        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: data,
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentUpdating: (e: { cancel: boolean }) => { e.cancel = true; },
        });

        scheduler.showAppointmentPopup(data[0]);

        POM.popup.setInputValueByLabel('Subject', 'New Subject');

        POM.popup.getSaveButton().click();
        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        await new Promise(process.nextTick);

        const appointment = POM.getAppointment('Subject');

        expect(appointment.getText()).toEqual('Subject');
      });

      it('onAppointmentUpdating and e.cancel=false (T907281)', async () => {
        const data = [{
          startDate: new Date(2015, 4, 24, 9),
          endDate: new Date(2015, 4, 24, 11),
          text: 'Subject',
        }];
        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: data,
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentUpdating: (e: { cancel: boolean }) => { e.cancel = false; },
        });

        scheduler.showAppointmentPopup(data[0]);

        POM.popup.setInputValueByLabel('Subject', 'New Subject');

        POM.popup.getSaveButton().click();
        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        await new Promise(process.nextTick);

        const appointment = POM.getAppointment('New Subject');

        expect(appointment.getText()).toEqual('New Subject');
      });
    });

    describe('onAppointmentDeleting', () => {
      it('onAppointmentDeleting and e.cancel=true', async () => {
        const data = [{
          text: 'Some Text',
          startDate: new Date(2015, 4, 24, 9),
          endDate: new Date(2015, 4, 24, 11),
        }];

        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: data,
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentDeleting: (e: { cancel: boolean }) => { e.cancel = true; },
        });

        scheduler.deleteAppointment(data[0]);
        await new Promise(process.nextTick);

        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        const appointment = POM.getAppointment();

        expect(appointment.getText()).toEqual('Some Text');
      });

      it('onAppointmentDeleting and e.cancel=false', async () => {
        const data = [{
          text: 'Some Text',
          startDate: new Date(2015, 4, 24, 9),
          endDate: new Date(2015, 4, 24, 11),
        }];

        const { scheduler, POM } = await createScheduler({
          views: ['day'],
          dataSource: data,
          currentDate: new Date(2015, 4, 24),
          startDayHour: 8,
          endDayHour: 18,
          onAppointmentDeleting: (e: { cancel: boolean }) => { e.cancel = false; },
        });

        scheduler.deleteAppointment(data[0]);
        await new Promise(process.nextTick);

        const loadPanel = POM.getLoadPanel();
        expect(loadPanel).toBeFalsy();

        const appointment = POM.getAppointment();

        expect(appointment.getText()).toEqual('');
      });
    });
  });

  describe('showAppointmentPopup', () => {
    it('should open appointment popup without data', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup();

      const expectedStartDate = new Date(scheduler.option('currentDate'));
      const expectedEndDate = new Date(expectedStartDate.getTime() + scheduler.option('cellDuration') * toMilliseconds('minute'));

      expect(POM.popup.component.option('visible')).toBe(true);
      expect(POM.popup.form.option('formData')).toEqual({
        text: undefined,
        allDay: false,
        startDate: expectedStartDate,
        endDate: expectedEndDate,
        description: undefined,
        recurrenceRule: undefined,
        startDateTimeZone: undefined,
        endDateTimeZone: undefined,
      });
    });
    it('should open appointment popup with correct data', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.component.option('visible')).toBe(true);
      expect(POM.popup.form.option('formData')).toMatchObject({
        ...commonAppointment,
      });
    });
  });

  describe('hideAppointmentPopup', () => {
    it('should hide appointment popup without saving changes', async () => {
      setupSchedulerTestEnvironment({ height: 200 });
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      POM.openPopupByDblClick('common-app');
      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      scheduler.hideAppointmentPopup();

      const dataItem = scheduler.option('dataSource')?.[1];

      expect(dataItem).toMatchObject({ ...commonAppointment });
    });

    it('should hide appointment popup with saving changes', async () => {
      setupSchedulerTestEnvironment({ height: 200 });
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      POM.openPopupByDblClick('common-app');
      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      scheduler.hideAppointmentPopup(true);

      const dataItem = scheduler.option('dataSource')?.[1];

      expect(dataItem).toMatchObject({ ...commonAppointment, text: 'New Subject' });
    });
  });

  describe('CustomStore', () => {
    it('Update appointment if CustomStore', async () => {
      const data: Record<string, unknown>[] = [{
        startDate: new Date(2015, 4, 24, 9),
        endDate: new Date(2015, 4, 24, 11),
      }];

      const { scheduler, POM } = await createScheduler({
        views: ['day'],
        dataSource: {
          key: 'id',
          load: () => data,
          update: (key: unknown, values: Record<string, unknown>) => Promise.resolve().then(() => {
            const appointmentData = data.filter((
              item: Record<string, unknown>,
            ) => (item as { id: unknown }).id === key)[0];
            Object.assign(appointmentData, values);
            scheduler.repaint();
          }),
        },
        currentDate: new Date(2015, 4, 24),
        startDayHour: 8,
        endDayHour: 18,
      });

      scheduler.showAppointmentPopup({
        startDate: new Date(2015, 4, 24, 9),
        endDate: new Date(2015, 4, 24, 11),
        text: 'Subject',
      });

      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      POM.popup.getSaveButton().click();
      const loadPanel = POM.getLoadPanel();
      expect(loadPanel).toBeTruthy();
      await new Promise(process.nextTick);
      const loadPanelAfter = POM.getLoadPanel();
      expect(loadPanelAfter).toBeFalsy();
    });

    it('Insert appointment if CustomStore', async () => {
      const fn = jest.fn();
      const data: Record<string, unknown>[] = [];
      const { scheduler, POM } = await createScheduler({
        views: ['day'],
        dataSource: {
          key: 'id',
          load: () => data,
          insert: (appointmentData: Record<string, unknown>) => Promise.resolve().then(() => {
            (appointmentData as { id: number }).id = data.length;
            data.push(appointmentData);
            fn();
          }),
        },
        currentDate: new Date(2015, 4, 24),
        startDayHour: 8,
        endDayHour: 18,
      });

      scheduler.showAppointmentPopup();

      POM.popup.setInputValueByLabel('Subject', 'New Subject');
      POM.popup.setInputValueByLabel('Start Date', '05/24/2015, 9:00 AM');
      POM.popup.setInputValueByLabel('End Date', '05/24/2015, 11:00 AM');

      POM.popup.getSaveButton().click();
      const loadPanel = POM.getLoadPanel();
      expect(loadPanel).toBeTruthy();
      await new Promise(process.nextTick);
      const loadPanelAfter = POM.getLoadPanel();
      expect(loadPanelAfter).toBeFalsy();
      expect(fn).toBeCalled();
    });
  });

  it('should update form data after another appointment was open', async () => {
    const { scheduler, POM } = await createScheduler(getDefaultConfig());

    scheduler.showAppointmentPopup(commonAppointment);

    expect(POM.popup.form.option('formData')).toMatchObject({ ...commonAppointment });

    POM.popup.getCancelButton().click();

    scheduler.showAppointmentPopup(allDayAppointment);

    expect(POM.popup.form.option('formData')).toMatchObject({ ...allDayAppointment });
  });

  it('should open appointment on tooltip click', async () => {
    setupSchedulerTestEnvironment({ height: 200 });
    const { POM } = await createScheduler(getDefaultConfig());

    expect(POM.getPopups().length).toBe(0);

    jest.useFakeTimers();
    POM.getAppointment('common-app').element?.click();
    jest.runAllTimers();

    POM.getTooltipAppointment()?.click();

    expect(POM.getPopups().length).toBe(1);
    expect(POM.popup.form.option('formData')).toMatchObject({ ...commonAppointment });
  });

  it('should update correct field if textExpr is defined', async () => {
    const data: Record<string, unknown>[] = [];
    const textExpValue = 'Subject';

    let newAppointment: any = null;

    const { scheduler, POM } = await createScheduler({
      dataSource: data,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 4, 27),
      textExpr: textExpValue,
      onAppointmentAdded: ({ appointmentData }) => {
        newAppointment = appointmentData;
      },
      height: 600,
    });

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Subject', 'qwerty');
    POM.popup.getSaveButton().click();

    expect(newAppointment?.[textExpValue]).toBe('qwerty');
    expect(newAppointment?.text).toBeUndefined();

    expect(data[0].Subject).toBe('qwerty');
    expect(data[0].text).toBeUndefined();
  });
});

describe('Appointment Popup Content', () => {
  it.todo('appointmentPopup should not prevent mouse/touch events by default (T968188)');
  it.todo('showAppointmentPopup method with passed a recurrence appointment should render popup(T698732)');
  it.todo('showAppointmentPopup should render a popup only once');
  it.todo('showAppointmentPopup should work correctly after scheduler repainting');
  it.todo('changing editing should work correctly after showing popup');
  it.todo('showAppointmentPopup should render a popup form only once');
  it.todo('popup should have right height');
  it.todo('showAppointmentPopup should render a popup content only once');
  it.todo('Popup should contain editors and components with right dx-rtl classes and rtlEnabled option value');
  it.todo('Popup should contains start datebox with right value');
  it.todo('Calendar of the start datebox should have right firstDayOfWeek value');
  it.todo('Popup should contains end datebox with right value');
  it.todo('Calendar of the end datebox should have right firstDayOfWeek value');
  it.todo('Changing startDateBox value should change endDateBox value if needed');
  it.todo('Changing startDateBox value should change endDateBox value if needed(when startDate and endDate are strings)');
  it.todo('startDateBox value should be valid');
  it.todo('Changing endDateBox value should change startDateBox value if needed');
  it.todo('Changing endDateBox value should change startDateBox value if needed(when startDate and endDate are strings)');
  it.todo('endDateBox value should be valid');
  it.todo('Popup should contains caption textbox with right value');
  it.todo('Confirm dialog should be shown when showAppointmentPopup for recurrence appointment was called');
  it.todo('Recurrence Editor should have right freq editor value if recurrence rule was set on init');
  it.todo('Popup should contain recurrence editor with right config');
  it.todo('Recurrence editor should change value if freq editor value changed');
  it.todo('Recurrence editor should has right startDate after form items change');
  it.todo('Popup should contains description editor');
  it.todo('Popup should contains allDay editor');
  it.todo('allDay changing should switch date & type in editors');
  it.todo('allDay changing should switch only type in editors, if startDate is undefined');
  it.todo('There are no exceptions when select date on the appointment popup, startDate > endDate');
  it.todo('There are no exceptions when select date on the appointment popup,startDate < endDate');
  it.todo('There are no exceptions when select date on the appointment popup,if dates are undefined');
  it.todo('Validate works always before done click');
  it.todo('Load panel should not be shown if validation is fail');
  it.todo('Done button default configuration should be correct');
  it.todo('Done button custom configuration should be correct');
  it.todo('Load panel should be hidden if event validation fail');
  it.todo('Load panel should be hidden at the second appointment form opening');
  it.todo('Appointment popup should contain resources and recurrence editor');
});

describe('Appointment Popup', () => {
  it.todo('focus is called on popup hiding');
  it.todo('Multiple showing appointment popup for recurrence appointments should work correctly');
  it.todo('Appointment popup will render even if no appointmentData is provided (T734413)');
  it.todo('Appointment popup will render with currentDate on showAppointmentPopup with no arguments');
  it.todo('Appointment form will have right dates on multiple openings (T727713)');
  it.todo('The vertical scroll bar is shown when an appointment popup fill to a small window\'s height');
  it.todo('The resize event of appointment popup is triggered the the window is resize');
});

describe('Timezone Editors', () => {
  it.todo('timeZone editors should have correct options');
  it.todo('timeZone editor should have correct display value for timezones with different offsets');
  it.todo('dataSource of timezoneEditor should be filtered');
});
