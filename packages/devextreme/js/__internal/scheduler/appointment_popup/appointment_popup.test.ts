import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type dxDateBox from '@js/ui/date_box';
import type { GroupItem, Item as FormItem } from '@js/ui/form';
import { toMilliseconds } from '@ts/utils/toMilliseconds';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from '../__tests__/__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from '../__tests__/__mock__/m_mock_scheduler';

const CLASSES = {
  icon: 'dx-scheduler-form-icon',
  hidden: 'dx-hidden',

  mainGroupHidden: 'dx-scheduler-form-main-group-hidden',
  recurrenceGroupHidden: 'dx-scheduler-form-recurrence-group-hidden',
};

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

    it('should have empty description, subject and timezone inputs when showing empty appointment after saving previous appointment', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
      });

      scheduler.showAppointmentPopup({ ...commonAppointment });

      POM.popup.form.getEditor('descriptionEditor')?.option('value', 'temp');
      POM.popup.form.getEditor('startTimeZoneEditor')?.option('value', 'America/Los_Angeles');
      POM.popup.form.getEditor('endTimeZoneEditor')?.option('value', 'America/Anchorage');

      POM.popup.getSaveButton().click();

      scheduler.showAppointmentPopup();

      expect(POM.popup.form.getEditor('subjectEditor')?.option('value')).toBe('');
      expect(POM.popup.form.getEditor('descriptionEditor')?.option('value')).toBe('');
      expect(POM.popup.form.getEditor('startTimeZoneEditor')?.option('value')).toBeUndefined();
      expect(POM.popup.form.getEditor('endTimeZoneEditor')?.option('value')).toBeUndefined();
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

    it('should set correct dates when switching on then off in day view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'day',
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('9:30 AM');
    });

    it('should set correct dates when switching off then on in day view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'day',
      });

      scheduler.showAppointmentPopup(allDayAppointment);

      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();
    });

    it('should set correct dates when switching on then off in month view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'month',
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/10/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('12:00 AM');
    });

    it('should set correct dates when switching off then on in month view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'month',
      });

      scheduler.showAppointmentPopup(allDayAppointment);

      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getSwitchByName('allDay').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();
    });

    it('should show correct dates after switching off allDay and canceling changes (T832711)', async () => {
      const { scheduler, POM } = await createScheduler(undefined);

      scheduler.showAppointmentPopup(allDayAppointment);
      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getCancelButton().click();

      scheduler.showAppointmentPopup(allDayAppointment);

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();
    });

    it('should show correct dates after switching on allDay and canceling changes (T832711)', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.getSwitchByName('allDay').click();
      POM.popup.getCancelButton().click();

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('11:00 AM');
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
    it('should allow opening recurrence settings when allowUpdating is false', async () => {
      const appointment = {
        text: 'Recurrent Appointment',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      };

      const { POM, scheduler } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating: false },
      });

      scheduler.showAppointmentPopup(appointment);

      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);

      POM.popup.openRecurrenceSettings();

      expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);
    });

    it('should be visible after changing repeat editor\'s value', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup();

      expect(POM.popup.isMainGroupVisible()).toBe(true);
      expect(POM.popup.mainGroup?.getAttribute('tabindex')).toBeNull();
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
      expect(POM.popup.recurrenceGroup?.getAttribute('tabindex')).toBe('-1');

      POM.popup.selectRepeatValue('weekly');
      await new Promise(process.nextTick);

      const popupHeight = POM.popup.component.option('height');
      expect(popupHeight).toBeDefined();
      expect(typeof popupHeight).toBe('number');

      expect(POM.popup.isMainGroupVisible()).toBe(false);
      expect(POM.popup.mainGroup?.getAttribute('tabindex')).toBe('-1');
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);
      expect(POM.popup.recurrenceGroup?.getAttribute('tabindex')).toBeNull();

      POM.popup.getBackButton().click();

      expect(POM.popup.component.option('height')).toBe('auto');
      expect(POM.popup.isMainGroupVisible()).toBe(true);
      expect(POM.popup.mainGroup?.getAttribute('tabindex')).toBeNull();
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
      expect(POM.popup.recurrenceGroup?.getAttribute('tabindex')).toBe('-1');
    });

    it('check that after opening recurrence appointment current form is main form', async () => {
      const appointment = {
        text: 'Recurrent Appointment',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      };

      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(appointment);

      POM.popup.getEditSeriesButton().click();

      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
    });

    it('should discard recurrence changes when clicking \'cancel\' button in recurrence form', async () => {
      const data = [
        {
          text: 'meet',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
          recurrenceRule: 'FREQ=DAILY;',
        },
      ];

      const { POM, scheduler } = await createScheduler({
        dataSource: data,
        currentDate: new Date(2017, 4, 22),
      });

      scheduler.showAppointmentPopup(data[0]);

      POM.popup.selectRepeatValue('weekly');

      // TODO: this method works weirdly
      scheduler.hideAppointmentPopup(true);

      expect(scheduler.option('dataSource')?.[0]).toEqual(data[0]);
    });

    describe('Editing and saving recurrence', () => {
      it('should populate form with existing weekly recurrence rule', async () => {
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
        const frequencyEditor = $(POM.popup.frequencyEditor).dxSelectBox('instance');
        expect(frequencyEditor.option('value')).toBe('weekly');

        const dayButtons = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
        const selectedButtons = dayButtons.filter('.dx-button-mode-contained');
        expect(selectedButtons.length).toBe(3);

        // @ts-expect-error
        const repeatEndEditor = $(POM.popup.repeatEndEditors).dxRadioGroup('instance');
        expect(repeatEndEditor.option('value')).toBe('count');

        // @ts-expect-error
        const countEditor = $(POM.popup.countEditor).dxNumberBox('instance');
        expect(countEditor.option('value')).toBe(10);
      });

      it('should save changes when saving from recurrence form', async () => {
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

        POM.popup.selectRepeatValue('daily');

        // @ts-expect-error
        const frequencyEditor = $(POM.popup.frequencyEditor).dxSelectBox('instance');
        frequencyEditor.option('value', 'weekly');

        POM.popup.getBackButton().click();

        POM.popup.getSaveButton().click();

        expect(scheduler.option('dataSource')?.[0]).toEqual({
          allDay: false,
          text: 'Meeting',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
        });
      });

      it('saves appointment after editing data in recurrence form', async () => {
        const data = [
          {
            text: 'Team Meeting',
            startDate: new Date(2017, 4, 15, 10, 0),
            endDate: new Date(2017, 4, 15, 11, 0),
            recurrenceRule: 'FREQ=DAILY',
          },
        ];

        const { POM, scheduler } = await createScheduler({
          dataSource: data,
          currentDate: new Date(2017, 4, 15),
          firstDayOfWeek: 1,
        });

        POM.openPopupByDblClick('Team Meeting');

        POM.popup.getEditSeriesButton().click();

        POM.popup.selectRepeatValue('weekly');

        POM.popup.openRecurrenceSettings();

        POM.popup.selectRecurrenceWeekDays([0, 4]);

        POM.popup.getBackButton().click();

        POM.popup.getSaveButton().click();

        const savedAppointment = scheduler.option('dataSource')?.[0];
        expect(savedAppointment).toMatchObject({
          text: 'Team Meeting',
          startDate: new Date(2017, 4, 15, 10, 0),
          endDate: new Date(2017, 4, 15, 11, 0),
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,FR',
        });
      });
    });
  });

  describe('firstDayOfWeek', () => {
    it('should apply firstDayOfWeek to week day buttons', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const dayButtonsMonday = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
      expect(dayButtonsMonday.length).toBe(7);
      expect(dayButtonsMonday.eq(0).text()).toBe('M');
      expect(dayButtonsMonday.eq(6).text()).toBe('S');

      scheduler.hideAppointmentPopup();
      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const dayButtonsSunday = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
      expect(dayButtonsSunday.length).toBe(7);
      expect(dayButtonsSunday.eq(0).text()).toBe('S');
      expect(dayButtonsSunday.eq(1).text()).toBe('M');
      expect(dayButtonsSunday.eq(6).text()).toBe('S');
    });

    it('should apply firstDayOfWeek to recurrence form startDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const recurrenceStartDateEditor = POM.popup.form.getEditor('recurrenceStartDateEditor');
      expect(recurrenceStartDateEditor).toBeDefined();
      expect(recurrenceStartDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const recurrenceStartDateEditorAfter = POM.popup.form.getEditor('recurrenceStartDateEditor');
      expect(recurrenceStartDateEditorAfter).toBeDefined();
      expect(recurrenceStartDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
    });

    it('should apply firstDayOfWeek to startDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      const startDateEditor = POM.popup.form.getEditor('startDateEditor');
      expect(startDateEditor).toBeDefined();
      expect(startDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);

      const startDateEditorAfter = POM.popup.form.getEditor('startDateEditor');
      expect(startDateEditorAfter).toBeDefined();
      expect(startDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
    });

    it('should apply firstDayOfWeek to endDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      const endDateEditor = POM.popup.form.getEditor('endDateEditor');
      expect(endDateEditor).toBeDefined();
      expect(endDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);

      const endDateEditorAfter = POM.popup.form.getEditor('endDateEditor');
      expect(endDateEditorAfter).toBeDefined();
      expect(endDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
    });
  });

  describe('Icons', () => {
    describe('Subject icon', () => {
      it('has default color when appointment has no resources', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup(commonAppointment);

        const $icon = $(POM.popup.subjectIcon);
        expect($icon.css('color')).toBe('');
      });

      it('has default color when showAppointmentPopup is called without data', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup();

        const $icon = $(POM.popup.subjectIcon);
        expect($icon.css('color')).toBe('');
      });

      it('has resource color when appointment has resource', async () => {
        const resourceColor1 = 'rgb(255, 0, 0)';
        const resourceColor2 = 'rgb(0, 0, 255)';
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          resources: [{
            fieldExpr: 'roomId',
            dataSource: [
              { id: 1, text: 'Room 1', color: resourceColor1 },
              { id: 2, text: 'Room 2', color: resourceColor2 },
            ],
          }],
        });

        scheduler.showAppointmentPopup({
          ...commonAppointment,
          roomId: 1,
        });

        await new Promise(process.nextTick);

        const $icon = $(POM.popup.subjectIcon);
        expect($icon.css('color')).toBe(resourceColor1);

        POM.popup.form.getEditor('roomId')?.option('value', 2);
        await new Promise(process.nextTick);

        expect($icon.css('color')).toBe(resourceColor2);
      });
    });

    describe('Resource icons', () => {
      it.each<{
        iconsShowMode: 'both' | 'main' | 'none' | 'recurrence';
        visibleMain: boolean;
        visibleRecurrence: boolean;
      }>([
        { iconsShowMode: 'both', visibleMain: true, visibleRecurrence: true },
        { iconsShowMode: 'main', visibleMain: true, visibleRecurrence: false },
        { iconsShowMode: 'recurrence', visibleMain: false, visibleRecurrence: true },
        { iconsShowMode: 'none', visibleMain: false, visibleRecurrence: false },
      ])('should shown icons correctly when iconsShowMode is \'$iconsShowMode\'', async ({ iconsShowMode, visibleMain, visibleRecurrence }) => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: { form: { iconsShowMode } },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const mainFormIcons = POM.popup.mainGroup?.querySelectorAll(`.${CLASSES.icon}`) ?? [];
        const recurrenceFormIcons = POM.popup.recurrenceGroup?.querySelectorAll(`.${CLASSES.icon}`) ?? [];

        expect(mainFormIcons.length).toBe(4);
        expect(recurrenceFormIcons.length).toBe(3);

        const mainIconsCorrect = Array.from(mainFormIcons).every((icon) => {
          const isVisible = !icon.classList.contains(CLASSES.hidden);
          return isVisible === visibleMain;
        });

        const recurrenceIconsCorrect = Array.from(recurrenceFormIcons).every((icon) => {
          const isVisible = !icon.classList.contains(CLASSES.hidden);
          return isVisible === visibleRecurrence;
        });

        expect(mainIconsCorrect).toBe(true);
        expect(recurrenceIconsCorrect).toBe(true);
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
        recurrenceRule: '',
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

  describe('Form customization', () => {
    it('should propagate editing.form options to the form instance', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            height: 500,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formHeight = form.option('height') as number;

      expect(formHeight).toBe(500);
    });

    it('should merge editing.form options with default form configuration', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            height: 500,
            elementAttr: { id: 'custom-form' },
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formHeight = form.option('height') as number;
      const elementAttr = form.option('elementAttr') as { class?: string; id?: string };
      const { class: className, id } = elementAttr;

      expect(formHeight).toBe(500);
      expect(className).toBe('dx-scheduler-form');
      expect(id).toBe('custom-form');
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

describe('Appointment Popup', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('should open on double click on appointment', async () => {
    setupSchedulerTestEnvironment({ height: 200 });
    const { POM } = await createScheduler(getDefaultConfig());

    expect(POM.getPopups().length).toBe(0);

    POM.openPopupByDblClick('common-app');

    expect(POM.getPopups().length).toBe(1);
    expect(POM.popup.form.option('formData')).toMatchObject({ ...commonAppointment });
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

  describe('Toolbar', () => {
    const toolbarWithSaveButton = [
      {
        toolbar: 'top',
        location: 'before',
        cssClass: 'dx-toolbar-label',
      },
      {
        toolbar: 'top',
        location: 'after',
        options: {
          onClick: expect.any(Function),
          stylingMode: 'contained',
          type: 'default',
          text: 'Save',
        },
        shortcut: 'done',
      },
      {
        toolbar: 'top',
        location: 'after',
        shortcut: 'cancel',
        options: { stylingMode: 'outlined' },
      },
    ];
    const toolbarWithCancelButton = [
      {
        toolbar: 'top',
        location: 'before',
        cssClass: 'dx-toolbar-label',
      },
      {
        toolbar: 'top',
        location: 'after',
        shortcut: 'cancel',
        options: { stylingMode: 'outlined' },
      },
    ];

    describe('Popup Title', () => {
      it('should display "New Appointment" when creating new appointment', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: { allowAdding: true },
        });

        scheduler.showAppointmentPopup();

        const toolbarItems = POM.popup.component.option('toolbarItems');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleItem = toolbarItems?.find((item: any) => item.cssClass === 'dx-toolbar-label');

        expect(titleItem?.text).toBe('New Appointment');
      });

      it('should display "Edit Appointment" when editing existing appointment', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: { allowUpdating: true },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const toolbarItems = POM.popup.component.option('toolbarItems');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleItem = toolbarItems?.find((item: any) => item.cssClass === 'dx-toolbar-label');

        expect(titleItem?.text).toBe('Edit Appointment');
      });
    });

    it.each([
      { allowUpdating: false, disabled: false },
      { allowUpdating: false, disabled: true },
      { allowUpdating: true, disabled: false },
      { allowUpdating: true, disabled: true },
    ])('Buttons visibility when %p', async ({ allowUpdating, disabled }) => {
      setupSchedulerTestEnvironment({ height: 200 });
      const shouldHaveSaveButton = allowUpdating && !disabled;

      const { POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating },
      });

      POM.openPopupByDblClick(disabled ? 'disabled-app' : 'common-app');

      if (shouldHaveSaveButton) {
        expect(POM.popup.component.option('toolbarItems')).toMatchObject(toolbarWithSaveButton);
      } else {
        expect(POM.popup.component.option('toolbarItems')).toMatchObject(toolbarWithCancelButton);
      }

      await POM.popup.component.hide();
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
      expect(POM.popup.component.option('toolbarItems')).toMatchObject(toolbarWithSaveButton);

      scheduler.option('editing', { allowUpdating: false, allowAdding: true });
      scheduler.showAppointmentPopup(newAppointment);
      expect(POM.popup.component.option('toolbarItems')).toMatchObject(toolbarWithCancelButton);

      await POM.popup.component.hide();
      scheduler.showAppointmentPopup();
      expect(POM.popup.component.option('toolbarItems')).toMatchObject(toolbarWithSaveButton);
    });
  });

  describe('Customization', () => {
    it('should pass custom popup options from editing.popup to appointment popup', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            showTitle: true,
            title: 'Custom Appointment Form',
            maxHeight: '80%',
            dragEnabled: true,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.component.option('showTitle')).toBe(true);
      expect(POM.popup.component.option('title')).toBe('Custom Appointment Form');
      expect(POM.popup.component.option('maxHeight')).toBe('80%');
      expect(POM.popup.component.option('dragEnabled')).toBe(true);
    });

    it('should use default popup options when editing.popup is not specified', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.component.option('showTitle')).toBe(false);
      expect(POM.popup.component.option('height')).toBe('auto');
      expect(POM.popup.component.option('maxHeight')).toBe('90%');
    });

    it('should merge custom popup options with default options', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            showTitle: true,
            title: 'My Form',
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.component.option('showTitle')).toBe(true);
      expect(POM.popup.component.option('title')).toBe('My Form');

      expect(POM.popup.component.option('showCloseButton')).toBe(false);
      expect(POM.popup.component.option('enableBodyScroll')).toBe(false);
      expect(POM.popup.component.option('preventScrollEvents')).toBe(false);
    });

    it('should allow overriding default popup options', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            showCloseButton: true,
            enableBodyScroll: true,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.component.option('showCloseButton')).toBe(true);
      expect(POM.popup.component.option('enableBodyScroll')).toBe(true);
    });

    it('should apply wrapperAttr configuration to popup', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            wrapperAttr: {
              id: 'test',
            },
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const wrapperAttr = POM.popup.component.option('wrapperAttr');
      expect(wrapperAttr.id).toBe('test');
      expect(wrapperAttr.class).toBeDefined();
    });

    it('should call onShowing callback when popup is shown', async () => {
      const onShowing = jest.fn();
      const onAppointmentFormOpening = jest.fn();
      const { scheduler } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            onShowing,
          },
        },
        onAppointmentFormOpening,
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(onShowing).toHaveBeenCalled();
      expect(onShowing).toHaveBeenCalledTimes(1);
      expect(onAppointmentFormOpening).toHaveBeenCalled();
      expect(onAppointmentFormOpening).toHaveBeenCalledTimes(1);
    });

    it('should call onHiding callback when popup is hidden', async () => {
      const onHiding = jest.fn();
      const { scheduler } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            onHiding,
          },
        },
      });

      const focusSpy = jest.spyOn(scheduler, 'focus');

      scheduler.showAppointmentPopup(commonAppointment);

      expect(onHiding).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();

      scheduler.hideAppointmentPopup();

      expect(onHiding).toHaveBeenCalled();
      expect(onHiding).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalledTimes(1);

      focusSpy.mockRestore();
    });

    it('should preserve custom toolbarItems when popup opens', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          popup: {
            toolbarItems: [{
              toolbar: 'top', location: 'before', text: 'Custom Title', cssClass: 'custom-title',
            }, {
              toolbar: 'top', location: 'after', widget: 'dxButton', options: { text: 'Custom Save' },
            }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const toolbarItems = POM.popup.component.option('toolbarItems');

      expect(toolbarItems).toBeDefined();
      expect(toolbarItems).toHaveLength(2);
      expect(toolbarItems).toContainEqual(expect.objectContaining({
        cssClass: 'custom-title', location: 'before', text: 'Custom Title', toolbar: 'top',
      }));
      expect(toolbarItems).toContainEqual(expect.objectContaining(
        {
          toolbar: 'top',
          location: 'after',
          widget: 'dxButton',
          options: expect.objectContaining({ text: 'Custom Save' }),
        },
      ));
    });

    it('should preserve custom toolbarItems when popup is reopened', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            toolbarItems: [{ toolbar: 'top', location: 'before', text: 'Custom Toolbar' }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);
      scheduler.hideAppointmentPopup();
      scheduler.showAppointmentPopup(allDayAppointment);

      const toolbarItems = POM.popup.component.option('toolbarItems');
      expect(toolbarItems).toBeDefined();
      expect(toolbarItems).toHaveLength(1);
      expect(toolbarItems?.[0]?.text).toBe('Custom Toolbar');
    });
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

describe('Timezone Editors', () => {
  it.todo('timeZone editors should have correct options');
  it.todo('timeZone editor should have correct display value for timezones with different offsets');
  it.todo('dataSource of timezoneEditor should be filtered');
});

describe('Customize form items', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  describe('Basic form customization', () => {
    it('should use default form when editing.items is not set', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems).toBeDefined();
      expect(formItems?.length).toBeGreaterThan(0);
    });

    it('should show empty form when editing.items is empty array', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems?.length ?? 0).toBe(0);
    });

    it('should show mainGroup when specified in string array', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: ['mainGroup'],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems?.length).toBe(1);
      expect(formItems?.[0]?.name).toBe('mainGroup');
    });

    it('should hide group when visible is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{ name: 'mainGroup', visible: false }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems?.length).toBe(1);
      expect(formItems?.[0]?.visible).toBe(false);
    });

    it('should show group when visible is true', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{ name: 'mainGroup', visible: true }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems?.length).toBe(1);
      expect(formItems?.[0]?.visible).toBe(true);
    });

    it('should filter children when items array is specified', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{
              name: 'mainGroup',
              visible: true,
              items: ['subjectGroup'],
            }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      const mainGroup = formItems?.[0] as GroupItem;

      expect(formItems?.length).toBe(1);
      expect(mainGroup?.items?.length).toBe(1);
      expect(mainGroup?.items?.[0]?.name).toBe('subjectGroup');
    });

    it('should handle non-existent groups gracefully', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: ['nonExistentGroup'],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];

      expect(formItems?.length ?? 0).toBe(1);
    });

    it('should call custom onContentReady and onInitialized and preserving default', async () => {
      const onContentReady = jest.fn();
      const onInitialized = jest.fn();
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        ...{
          editing: {
            form: {
              onContentReady,
              onInitialized,
            },
          },
        },
      });

      scheduler.showAppointmentPopup();
      const recurrenceGroup = $(POM.popup.recurrenceGroup);

      POM.popup.selectRepeatValue('weekly');

      await new Promise(process.nextTick);

      const mainGroup = $(POM.popup.mainGroup);

      expect(mainGroup.hasClass(CLASSES.mainGroupHidden)).toBe(true);
      expect(recurrenceGroup.hasClass(CLASSES.recurrenceGroupHidden)).toBe(false);

      expect(onContentReady).toHaveBeenCalled();
      expect(onInitialized).toHaveBeenCalled();
    });
  });

  it('should call custom onContentReady and onInitialized and preserving default', async () => {
    const onContentReady = jest.fn();
    const onInitialized = jest.fn();
    const { scheduler, POM } = await createScheduler({
      ...getDefaultConfig(),
      ...{
        editing: {
          form: {
            onContentReady,
            onInitialized,
          },
        },
      },
    });

    scheduler.showAppointmentPopup();

    POM.popup.selectRepeatValue('weekly');

    await new Promise(process.nextTick);

    expect(POM.popup.isMainGroupVisible()).toBe(false);
    expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);

    expect(onContentReady).toHaveBeenCalled();
    expect(onInitialized).toHaveBeenCalled();
  });

  describe('Form customization with editing.items', () => {
    it('should handle empty items array', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBe(0);
    });

    it('should handle string array configuration', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: ['mainGroup'],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBe(1);
      expect((formItems?.[0] as GroupItem)?.name).toBe('mainGroup');
    });

    it('should handle object configuration with visible false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{ name: 'mainGroup', visible: false }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBe(1);
      expect(formItems?.[0]?.visible).toBe(false);
    });

    it('should handle object configuration with custom items', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{
              name: 'mainGroup',
              items: ['subjectGroup', 'dateGroup'],
            }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      const mainGroup = formItems?.[0] as GroupItem;
      expect(mainGroup?.items?.length).toBe(2);
      expect((mainGroup?.items?.[0] as GroupItem)?.name).toBe('subjectGroup');
      expect((mainGroup?.items?.[1] as GroupItem)?.name).toBe('dateGroup');
    });

    it('should handle non-existent group names', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: ['nonExistentGroup'],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBe(1);
    });

    it('should handle undefined items', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: undefined,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBeGreaterThan(0);
    });

    it('should handle mixed configurations', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [
              'mainGroup',
              { name: 'mainGroup', visible: false },
            ],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      expect(formItems?.length).toBe(2);
      expect((formItems?.[0] as any)?.name).toBe('mainGroup');
      expect((formItems?.[1] as any)?.name).toBe('mainGroup');
      expect(formItems?.[1]?.visible).toBe(false);
    });

    it('should handle empty items array in object config', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          form: {
            items: [{
              name: 'mainGroup',
              items: [],
            }],
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const { form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      const mainGroup = formItems?.[0] as any;
      expect(mainGroup?.items?.length).toBe(0);
    });
  });
});
