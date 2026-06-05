import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import dateLocalization from '@js/common/core/localization/date';
import { CustomStore } from '@js/common/data/custom_store';
import $ from '@js/core/renderer';
import type { ToolbarItem } from '@js/ui/popup';
import { toMilliseconds } from '@ts/utils/toMilliseconds';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from '../__tests__/__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from '../__tests__/__mock__/m_mock_scheduler';
import { DEFAULT_SCHEDULER_OPTIONS } from '../utils/options/constants';

const CLASSES = {
  icon: 'dx-scheduler-form-icon',
  hidden: 'dx-hidden',

  scheduler: 'dx-scheduler',
  mainGroupHidden: 'dx-scheduler-form-main-group-hidden',
  recurrenceGroupHidden: 'dx-scheduler-form-recurrence-group-hidden',
};

const recurringAppointment = {
  text: 'recurring-app',
  startDate: new Date(2017, 4, 1, 9, 30),
  endDate: new Date(2017, 4, 1, 11),
  recurrenceRule: 'FREQ=DAILY;COUNT=5',
};
const commonAppointment = {
  text: 'common-app',
  startDate: new Date(2017, 4, 9, 9, 30),
  endDate: new Date(2017, 4, 9, 11),
};
const disabledAppointment = {
  text: 'disabled-app',
  startDate: new Date(2017, 4, 22, 9, 30),
  endDate: new Date(2017, 4, 22, 11, 30),
  disabled: true,
};
const allDayAppointment = {
  text: 'all-day-app',
  startDate: new Date(2017, 4, 1),
  endDate: new Date(2017, 4, 1),
  allDay: true,
};

const getDefaultConfig = () => ({
  dataSource: [],
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
  firstDayOfWeek: 1,
  startDayHour: 9,
  height: 600,
  width: 600,
});

describe('Appointment Form', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
    jest.useRealTimers();
  });

  describe('Changes saving/canceling', () => {
    it('should update appointment when data source is a custom store', async () => {
      const appointment = { ...commonAppointment, id: 0 };

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: {
          store: {
            type: 'array',
            key: 'id',
            data: [appointment],
          },
        },
      });

      scheduler.showAppointmentPopup(appointment);
      POM.popup.setInputValue('subjectEditor', 'Updated subject');
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const items = (scheduler as any).getDataSource().items();

      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        ...appointment,
        text: 'Updated subject',
      });
    });

    it('should create appointment when data source is a custom store', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: {
          store: {
            type: 'array',
            key: 'id',
            data: [],
          },
        },
      });

      scheduler.showAppointmentPopup();
      POM.popup.setInputValue('subjectEditor', 'New subject');
      POM.popup.setInputValue('startDateEditor', new Date(2017, 4, 25, 9, 0));
      POM.popup.setInputValue('startTimeEditor', new Date(2017, 4, 25, 9, 0));
      POM.popup.setInputValue('endDateEditor', new Date(2017, 4, 25, 10, 0));
      POM.popup.setInputValue('endTimeEditor', new Date(2017, 4, 25, 10, 0));
      POM.popup.setInputValue('descriptionEditor', 'New appointment description');
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const items = (scheduler as any).getDataSource().items();

      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        text: 'New subject',
        startDate: new Date(2017, 4, 25, 9, 0),
        endDate: new Date(2017, 4, 25, 10, 0),
        description: 'New appointment description',
      });
    });

    it('should update resource value on save button click', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          roomId: 1,
        }],
        resources: [{
          fieldExpr: 'roomId',
          dataSource: [
            { text: 'Room 1', id: 1, color: '#00af2c' },
            { text: 'Room 2', id: 2, color: '#56ca85' },
            { text: 'Room 3', id: 3, color: '#8ecd3c' },
          ],
        }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.setInputValue('roomId', 2);
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0].roomId).toBe(2);
    });

    it('should create separate appointment when saving single appointment from series', async () => {
      const appointment = {
        text: 'recurring-app',
        startDate: '2017-05-01T09:30:00.000Z',
        endDate: '2017-05-01T11:00:00.000Z',
        recurrenceRule: 'FREQ=DAILY;COUNT=5',
      };

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...appointment }],
      });
      const dataSource = (scheduler as any).getDataSource();

      POM.openPopupByDblClick('recurring-app');
      POM.popup.editAppointmentButton.click();
      POM.popup.setInputValue('subjectEditor', 'single appointment');
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      expect(dataSource.items()).toHaveLength(2);
      expect(dataSource.items()[0]).toEqual({
        ...appointment,
        recurrenceException: '20170501T093000Z',
      });
      expect(dataSource.items()[1]).toEqual({
        ...appointment,
        text: 'single appointment',
        recurrenceRule: '',
        allDay: false,
      });
    });
  });

  describe('Validation', () => {
    it('should close popup on save when startDateEditor is empty in recurrence form', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({ ...commonAppointment });

      POM.popup.setInputValue('startDateEditor', null);
      POM.popup.selectRepeatValue('daily');

      expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/9/2017');

      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(POM.isPopupVisible()).toBe(false);
    });
  });

  describe('State', () => {
    it('should have correct editor values when opening for empty date cell - 1', async () => {
      const { POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'week',
      });

      POM.dblClickDateTableCell(0, 0);

      expect(POM.popup.getInputValue('subjectEditor')).toBe('');
      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/22/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/22/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('9:30 AM');
      expect(POM.popup.getInputValue('allDayEditor')).toBe('false');
      expect(POM.popup.getInputValue('descriptionEditor')).toBe('');
    });

    it('should have correct editor values when opening for empty date cell - 2', async () => {
      const { POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'week',
      });

      POM.dblClickDateTableCell(1, 1);

      expect(POM.popup.getInputValue('subjectEditor')).toBe('');
      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/23/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/23/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('10:00 AM');
      expect(POM.popup.getInputValue('allDayEditor')).toBe('false');
      expect(POM.popup.getInputValue('descriptionEditor')).toBe('');
    });

    it('should have correct editor values when opening for empty all day cell', async () => {
      const { POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'week',
      });

      POM.dblClickAllDayTableCell(1);

      expect(POM.popup.getInputValue('subjectEditor')).toBe('');
      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/23/2017');
      expect(POM.popup.isInputVisible('startTimeEditor')).toBe(false);
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/23/2017');
      expect(POM.popup.isInputVisible('endTimeEditor')).toBe(false);
      expect(POM.popup.getInputValue('allDayEditor')).toBe('true');
      expect(POM.popup.getInputValue('descriptionEditor')).toBe('');
    });
  });

  describe('Readonly state', () => {
    it('form should be readonly when editing.allowUpdating is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating: false },
      });

      scheduler.showAppointmentPopup({ ...commonAppointment });

      expect(POM.popup.dxForm.option('readOnly')).toBe(true);
    });

    it('form should not be readonly when editing.allowUpdating is false and adding a new appointment', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating: false, allowAdding: true },
      });

      scheduler.showAppointmentPopup({ ...commonAppointment }, true);

      expect(POM.popup.dxForm.option('readOnly')).toBe(false);
    });

    it('form should be readonly after adding new appointment if editing.allowUpdating is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating: false, allowAdding: true },
      });
      const dataSource = (scheduler as any).getDataSource();

      scheduler.showAppointmentPopup({ ...commonAppointment }, true);
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);

      expect(POM.popup.dxForm.option('readOnly')).toBe(true);
    });

    it('form should be readonly when appointment is disabled', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...disabledAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);

      expect(POM.popup.dxForm.option('readOnly')).toBe(true);
    });
  });

  describe('startDate/endDate editors behavior', () => {
    it.each([
      ['startDateEditor', 'startTimeEditor'],
      ['endDateEditor', 'endTimeEditor'],
      ['startTimeEditor', 'startDateEditor'],
      ['endTimeEditor', 'endDateEditor'],
    ])('when %s value is set to null, %s value should not be null', async (dateEditorName, timeEditorName) => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({ ...commonAppointment });

      POM.popup.setInputValue(dateEditorName, null);

      expect(POM.popup.getInputValue(timeEditorName)).not.toBeNull();
    });
  });

  describe.each([
    ['Field expressions', 'customField'],
    ['Nested field expressions', 'nested.customField'],
  ])('%s', (exprValue) => {
    it.each([
      ['textExpr', 'subjectEditor', 'qwerty'],
      ['allDayExpr', 'allDayEditor', true],
      ['startDateTimeZoneExpr', 'startDateTimeZoneEditor', 'Pacific/Midway'],
      ['endDateTimeZoneExpr', 'endDateTimeZoneEditor', 'Pacific/Midway'],
      ['descriptionExpr', 'descriptionEditor', 'qwerty'],
    ])('should update correct field if %s is defined', async (fieldExpr, editorName, value) => {
      const defaultField = DEFAULT_SCHEDULER_OPTIONS[fieldExpr];

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
        [fieldExpr]: exprValue,
      });

      scheduler.showAppointmentPopup();

      POM.popup.setInputValue(editorName, value);
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const customFieldValue = scheduler.option(`dataSource[0].${exprValue}`);
      const defaultFieldValue = scheduler.option(`dataSource[0].${defaultField}`);

      expect(customFieldValue).toBe(value);
      expect(defaultFieldValue).toBeUndefined();
    });

    it.each([
      ['startDateExpr', 'startDateEditor', 'startTimeEditor'],
      ['endDateExpr', 'endDateEditor', 'endTimeEditor'],
    ])('should update correct field if %s is defined', async (fieldExpr, dateEditorName, timeEditorName) => {
      const value = new Date(2017, 4, 9, 9, 30);

      const defaultField = DEFAULT_SCHEDULER_OPTIONS[fieldExpr] as string;

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
        [fieldExpr]: exprValue,
      });

      scheduler.showAppointmentPopup();

      POM.popup.setInputValue(dateEditorName, value);
      POM.popup.setInputValue(timeEditorName, value);
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const customFieldValue = scheduler.option(`dataSource[0].${exprValue}`);
      const defaultFieldValue = scheduler.option(`dataSource[0].${defaultField}`);

      expect(customFieldValue).toEqual(new Date(value));
      expect(defaultFieldValue).toBeUndefined();
    });

    it('should update correct field if recurrenceRuleExpr is defined', async () => {
      const fieldExpr = 'recurrenceRuleExpr';
      const defaultField = DEFAULT_SCHEDULER_OPTIONS[fieldExpr] as string;

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
        [fieldExpr]: exprValue,
      });

      scheduler.showAppointmentPopup();
      POM.popup.selectRepeatValue('daily');
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const customFieldValue = scheduler.option(`dataSource[0].${exprValue}`);
      const defaultFieldValue = scheduler.option(`dataSource[0].${defaultField}`);

      expect(customFieldValue).toBe('FREQ=DAILY');
      expect(defaultFieldValue).toBeUndefined();
    });

    it('should update correct resource field if fieldExpr for resource is defined', async () => {
      const defaultField = 'roomId';

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
        resources: [{
          fieldExpr: exprValue,
          allowMultiple: false,
          dataSource: [
            { text: 'Room 1', id: 1, color: '#00af2c' },
            { text: 'Room 2', id: 2, color: '#56ca85' },
            { text: 'Room 3', id: 3, color: '#8ecd3c' },
          ],
        }],
      });

      scheduler.showAppointmentPopup();

      POM.popup.setInputValue(exprValue, 2);
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      const customFieldValue = scheduler.option(`dataSource[0].${exprValue}`);
      const defaultFieldValue = scheduler.option(`dataSource[0].${defaultField}`);

      expect(customFieldValue).toBe(2);
      expect(defaultFieldValue).toBeUndefined();
    });
  });

  describe('allDay switch', () => {
    it('should set correct dates when switching on then off in day view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'day',
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.getInput('allDayEditor').click();
      POM.popup.getInput('allDayEditor').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('9:30 AM');
    });

    it('should set correct dates when switching on then off in month view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'month',
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.getInput('allDayEditor').click();
      POM.popup.getInput('allDayEditor').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/10/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toBe('12:00 AM');
    });
  });

  describe('Timezone Editors', () => {
    it('should have correct timezone editors values', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowTimeZoneEditing: true,
        },
      });

      scheduler.showAppointmentPopup({
        text: 'Watercolor Landscape',
        startDate: new Date('2020-06-01T17:30:00.000Z'),
        endDate: new Date('2020-06-01T19:00:00.000Z'),
        startDateTimeZone: 'Etc/GMT+10',
        endDateTimeZone: 'US/Alaska',
      });

      expect(POM.popup.getInputValue('startDateTimeZoneEditor')).toBe('Etc/GMT+10');
      expect(POM.popup.getInputValue('endDateTimeZoneEditor')).toBe('US/Alaska');
    });

    it('should be shown when editing.allowTimeZoneEditing is true', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.isInputVisible('startDateTimeZoneEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endDateTimeZoneEditor')).toBeTruthy();
    });

    it('should be hidden when editing.allowTimeZoneEditing is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: false },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.isInputVisible('startDateTimeZoneEditor')).toBeFalsy();
      expect(POM.popup.isInputVisible('endDateTimeZoneEditor')).toBeFalsy();
    });

    it('change of startTimeZone value should trigger endTimeZone value change', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.setInputValue('startDateTimeZoneEditor', 'America/Los_Angeles');

      expect(POM.popup.getInputValue('startDateTimeZoneEditor')).toBe('America/Los_Angeles');
      expect(POM.popup.getInputValue('endDateTimeZoneEditor')).toBe('America/Los_Angeles');
    });

    it('change of endTimeZone value should not trigger startTimeZone value change', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowTimeZoneEditing: true },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      POM.popup.setInputValue('startDateTimeZoneEditor', 'America/Los_Angeles');
      POM.popup.setInputValue('endDateTimeZoneEditor', 'America/New_York');

      expect(POM.popup.getInputValue('startDateTimeZoneEditor')).toBe('America/Los_Angeles');
      expect(POM.popup.getInputValue('endDateTimeZoneEditor')).toBe('America/New_York');
    });
  });

  describe('Resources', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should load resource dataSource only once', async () => {
      const resourceDataSource = new CustomStore({
        load: () => [
          { text: 'Owner 1', id: 1 },
          { text: 'Owner 2', id: 2 },
          { text: 'Owner 3', id: 3 },
        ],
        byKey: () => {},
      });
      const loadSpy = jest.spyOn(resourceDataSource, 'load');
      const byKeySpy = jest.spyOn(resourceDataSource, 'byKey');

      const { scheduler } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          ownerId: [2],
        }],
        resources: [{
          allowMultiple: true,
          fieldExpr: 'ownerId',
          dataSource: resourceDataSource,
        }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      expect(loadSpy).toHaveBeenCalledTimes(1);

      scheduler.showAppointmentPopup(appointment);

      expect(loadSpy).toHaveBeenCalledTimes(1);
      expect(byKeySpy).toHaveBeenCalledTimes(0);
    });

    it('should not trigger extra CustomStore load on second popup open', async () => {
      const loadFn = jest.fn().mockImplementation(() => Promise.resolve([
        { text: 'Owner 1', id: 1 },
        { text: 'Owner 2', id: 2 },
      ]));
      const resourceDataSource = new CustomStore({
        load: loadFn as any,
        byKey: () => {},
      });

      const { scheduler } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          ownerId: 1,
        }],
        resources: [{
          fieldExpr: 'ownerId',
          dataSource: resourceDataSource,
        }],
      });

      jest.useFakeTimers();

      const appointment = (scheduler as any).getDataSource().items()[0];
      scheduler.showAppointmentPopup(appointment);
      scheduler.hideAppointmentPopup(false);
      scheduler.showAppointmentPopup(appointment);
      await jest.runAllTimersAsync();

      expect(loadFn).toHaveBeenCalledTimes(1);
    });

    it('should recreate appointment form synchronously when resources option changes', async () => {
      const { scheduler } = await createScheduler({
        ...getDefaultConfig(),
        resources: [{
          fieldExpr: 'roomId',
          dataSource: [{ id: 1, text: 'Room 1' }],
        }],
      });
      const formBefore = (scheduler as any).appointmentForm;

      scheduler.option('resources', [{
        fieldExpr: 'ownerId',
        dataSource: [{ id: 1, text: 'Owner 1' }],
      }]);

      const formAfter = (scheduler as any).appointmentForm;
      expect(formAfter).not.toBe(formBefore);
      expect(formAfter.config.resourceManager)
        .toBe((scheduler as any).resourceManager);
    });
  });
  describe('firstDayOfWeek', () => {
    beforeEach(() => {
      jest.spyOn(dateLocalization, 'firstDayOfWeekIndex').mockReturnValue(3);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should pass value from localization firstDayOfWeek to calendars when option is not set', async () => {
      const { POM, scheduler } = await createScheduler({
        ...getDefaultConfig(),
        firstDayOfWeek: undefined,
      });

      scheduler.showAppointmentPopup(commonAppointment);

      const startDateEditor = POM.popup.dxForm.getEditor('startDateEditor');
      expect(startDateEditor).toBeDefined();
      expect(startDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(3);
    });
  });

  describe('Icons', () => {
    describe('Subject icon', () => {
      it('has default color when showAppointmentPopup is called without data', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup();

        const $icon = $(POM.popup.subjectIcon);
        expect($icon.css('color')).toBe('');
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

        const mainFormIcons = POM.popup.mainGroup.querySelectorAll(`.${CLASSES.icon}`);
        const recurrenceFormIcons = POM.popup.recurrenceGroup.querySelectorAll(`.${CLASSES.icon}`);

        expect(mainFormIcons.length).toBe(visibleMain ? 4 : 0);
        expect(recurrenceFormIcons.length).toBe(visibleRecurrence ? 3 : 0);
      });
    });
  });

  describe('Callbacks', () => {
    describe('OnAppointmentFormOpening', () => {
      it('should be called when showing appointment popup', async () => {
        const onAppointmentFormOpening = jest.fn();
        const { scheduler } = await createScheduler({
          ...getDefaultConfig(),
          onAppointmentFormOpening,
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const arg = onAppointmentFormOpening.mock.calls[0][0] as any;

        expect(onAppointmentFormOpening).toHaveBeenCalledTimes(1);
        expect(arg).toHaveProperty('popup');
        expect(arg).toHaveProperty('form');
        expect(arg.appointmentData).toEqual(
          expect.objectContaining({ ...commonAppointment }),
        );
      });

      it('should correctly handle e.cancel=true', async () => {
        const { POM, scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentFormOpening: (e) => { e.cancel = true; },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        expect(POM.isPopupVisible()).toBe(false);
      });

      it('should handle e.cancel value: false', async () => {
        const { POM, scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentFormOpening: (e) => { e.cancel = false; },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        expect(POM.isPopupVisible()).toBe(true);
      });
    });

    describe('onAppointmentAdding', () => {
      it('should be called when saving new appointment', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        const addAppointmentSpy = jest.spyOn(scheduler, 'addAppointment');

        scheduler.showAppointmentPopup({ ...commonAppointment }, true);
        POM.popup.saveButton.click();
        await Promise.resolve();

        expect(addAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(addAppointmentSpy).toHaveBeenCalledWith(
          expect.objectContaining({ ...commonAppointment }),
        );
      });

      it('should correctly handle e.cancel=true', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          onAppointmentAdding: (e) => { e.cancel = true; },
        });

        scheduler.showAppointmentPopup({ ...commonAppointment }, true);
        POM.popup.saveButton.click();
        await Promise.resolve();

        const dataSource = (scheduler as any).getDataSource();
        expect(dataSource.items().length).toBe(0);
      });

      it('should correctly handle e.cancel=false', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          onAppointmentAdding: (e) => { e.cancel = false; },
        });

        scheduler.showAppointmentPopup({ ...commonAppointment }, true);
        POM.popup.saveButton.click();
        await Promise.resolve();

        const dataSource = (scheduler as any).getDataSource();
        expect(dataSource.items().length).toBe(1);
        expect(dataSource.items()[0]).toMatchObject(commonAppointment);
      });
    });

    describe('onAppointmentUpdating', () => {
      it('should be called when saving appointment', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
        });
        const updateAppointmentSpy = jest.spyOn(scheduler, 'updateAppointment');
        const dataSource = (scheduler as any).getDataSource();
        const updatedItem = dataSource.items()[0];

        scheduler.showAppointmentPopup(updatedItem);
        POM.popup.setInputValue('subjectEditor', 'Updated Subject');
        POM.popup.saveButton.click();
        await Promise.resolve();

        expect(updateAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(updateAppointmentSpy).toHaveBeenCalledWith(updatedItem, updatedItem);
      });

      it('should correctly handle e.cancel=true (T907281)', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentUpdating: (e) => { e.cancel = true; },
        });
        const dataSource = (scheduler as any).getDataSource();
        const updatedItem = dataSource.items()[0];

        scheduler.showAppointmentPopup(updatedItem);
        POM.popup.setInputValue('subjectEditor', 'Updated Subject');
        POM.popup.saveButton.click();
        await Promise.resolve();

        expect(dataSource.items()[0]).toEqual(commonAppointment);
      });

      it('should correctly handle e.cancel=false (T907281)', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentUpdating: (e) => { e.cancel = false; },
        });
        const dataSource = (scheduler as any).getDataSource();
        const updatedItem = dataSource.items()[0];

        scheduler.showAppointmentPopup(updatedItem);
        POM.popup.setInputValue('subjectEditor', 'New Subject');
        POM.popup.saveButton.click();
        await Promise.resolve();

        expect(dataSource.items()[0]).toEqual({
          allDay: false,
          recurrenceRule: '',
          ...commonAppointment,
          text: 'New Subject',
        });
      });
    });

    describe('onAppointmentDeleting', () => {
      it('should be called when deleting appointment', async () => {
        const { scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
        });
        const deleteAppointmentSpy = jest.spyOn(scheduler, 'deleteAppointment');
        const dataSource = (scheduler as any).getDataSource();
        const dataItem = dataSource.items()[0];

        scheduler.deleteAppointment(dataItem);

        expect(deleteAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(deleteAppointmentSpy).toHaveBeenCalledWith(dataItem);
      });

      it('should correctly handle e.cancel=true', async () => {
        const { scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentDeleting: (e) => { e.cancel = true; },
        });
        const dataSource = (scheduler as any).getDataSource();
        const dataItem = dataSource.items()[0];

        scheduler.deleteAppointment(dataItem);

        expect(dataSource.items().length).toBe(1);
      });

      it('should correctly handle e.cancel=false', async () => {
        const { scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [{ ...commonAppointment }],
          onAppointmentDeleting: (e) => { e.cancel = false; },
        });
        const dataSource = (scheduler as any).getDataSource();
        const dataItem = dataSource.items()[0];

        scheduler.deleteAppointment(dataItem);

        expect(dataSource.items().length).toBe(0);
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
      expect(POM.popup.dxForm.option('formData')).toEqual({
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
      expect(POM.popup.dxForm.option('formData')).toMatchObject({
        ...commonAppointment,
      });
    });
  });

  describe('hideAppointmentPopup', () => {
    it('should hide appointment popup without saving changes', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      scheduler.hideAppointmentPopup(false);

      expect(dataSource.items()[0]).toMatchObject(commonAppointment);
    });

    it('should hide appointment popup with saving changes', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({ ...commonAppointment, text: 'New Subject' });
    });

    it('should hide appointment popup with saving changes when recurrence form is opened', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.selectRepeatValue('weekly');
      POM.popup.setInputValue('recurrenceStartDateEditor', new Date(2024, 4, 25));
      scheduler.hideAppointmentPopup(true);
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({
        ...commonAppointment,
        startDate: new Date(2024, 4, 25, 9, 30),
        endDate: new Date(2024, 4, 25, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      });
    });
  });
});

describe('Appointment Popup', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
    jest.useRealTimers();
  });

  it('should open on double click on appointment', async () => {
    const { POM } = await createScheduler({
      ...getDefaultConfig(),
      dataSource: [{ ...commonAppointment }],
    });

    expect(POM.isPopupVisible()).toBe(false);

    POM.openPopupByDblClick('common-app');

    expect(POM.isPopupVisible()).toBe(true);
    expect(POM.popup.dxForm.option('formData')).toMatchObject({ ...commonAppointment });
  });

  it('should open on tooltip click', async () => {
    const { POM } = await createScheduler({
      ...getDefaultConfig(),
      dataSource: [{ ...commonAppointment }],
    });

    expect(POM.isPopupVisible()).toBe(false);

    jest.useFakeTimers();
    POM.getAppointment('common-app').element?.click();
    jest.runAllTimers();

    POM.tooltip.getAppointmentItem()?.click();

    expect(POM.isPopupVisible()).toBe(true);
    expect(POM.popup.dxForm.option('formData')).toMatchObject({ ...commonAppointment });
  });

  it('should focus appointment after closing popup', async () => {
    const { POM, keydown } = await createScheduler({
      ...getDefaultConfig(),
      dataSource: [{ ...recurringAppointment }],
    });

    const appointmentElement = POM.getAppointment('recurring-app').element as HTMLElement;
    appointmentElement.focus();

    jest.useFakeTimers();
    keydown(appointmentElement, 'Enter');
    POM.popup.closeButton.click();
    jest.runAllTimers();

    expect(appointmentElement?.classList.contains('dx-state-focused')).toBe(true);
  });

  describe('Toolbar', () => {
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
    ])('Buttons visibility in main form when %p', async ({ allowUpdating, disabled }) => {
      const shouldHaveSaveButton = allowUpdating && !disabled;

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating },
      });

      scheduler.showAppointmentPopup(disabled ? disabledAppointment : commonAppointment);

      const toolbarItems = POM.popup.component.option('toolbarItems') ?? [];

      expect(toolbarItems.some((i) => (i as any).shortcut === 'cancel')).toBe(true);
      expect(toolbarItems.some((i) => (i as any).shortcut === 'done')).toBe(shouldHaveSaveButton);
    });

    it.each([
      { allowUpdating: false, disabled: false },
      { allowUpdating: false, disabled: true },
      { allowUpdating: true, disabled: false },
      { allowUpdating: true, disabled: true },
    ])('Buttons visibility in recurrence form when %p', async ({ allowUpdating, disabled }) => {
      const shouldHaveSaveButton = allowUpdating && !disabled;

      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: { allowUpdating },
        dataSource: [],
      });

      scheduler.showAppointmentPopup({
        ...recurringAppointment,
        disabled,
      });

      if (allowUpdating) {
        POM.popup.editSeriesButton.click();
      }

      POM.popup.recurrenceSettingsButton.click();

      const toolbarItems = POM.popup.component.option('toolbarItems') ?? [];

      expect(toolbarItems.some((i) => (i as any).shortcut === 'cancel')).toBe(true);
      expect(toolbarItems.some((i) => (i as any).shortcut === 'done')).toBe(shouldHaveSaveButton);
    });

    it('Buttons visibility after editing option changed', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowUpdating: true,
          allowAdding: true,
        },
      });

      const getToolbarItems = (): ToolbarItem [] => POM.popup.component.option('toolbarItems') ?? [];

      const doneButtonMatcher = expect.arrayContaining([
        expect.objectContaining({
          shortcut: 'done',
        }),
      ]);
      const cancelButtonMatcher = expect.arrayContaining([
        expect.objectContaining({
          shortcut: 'cancel',
        }),
      ]);

      scheduler.showAppointmentPopup();

      expect(getToolbarItems()).toEqual(doneButtonMatcher);
      expect(getToolbarItems()).toEqual(cancelButtonMatcher);

      scheduler.option('editing', { allowUpdating: false, allowAdding: true });
      scheduler.showAppointmentPopup(commonAppointment);

      expect(getToolbarItems()).not.toEqual(doneButtonMatcher);
      expect(getToolbarItems()).toEqual(cancelButtonMatcher);

      await POM.popup.component.hide();
      scheduler.showAppointmentPopup();

      expect(getToolbarItems()).toEqual(doneButtonMatcher);
      expect(getToolbarItems()).toEqual(cancelButtonMatcher);
    });
  });

  describe('Customization', () => {
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
  it.todo('showAppointmentPopup should render a popup only once');
  it.todo('showAppointmentPopup should work correctly after scheduler repainting');
  it.todo('changing editing should work correctly after showing popup');
  it.todo('showAppointmentPopup should render a popup form only once');
  it.todo('showAppointmentPopup should render a popup content only once');
  it.todo('Recurrence editor should has right startDate after form items change');
  it.todo('There are no exceptions when select date on the appointment popup,if dates are undefined');
  it.todo('Validate works always before done click');
  it.todo('Load panel should not be shown if validation is fail');
  it.todo('Load panel should be hidden if event validation fail');
  it.todo('Load panel should be hidden at the second appointment form opening');
});

describe('Timezone Editors', () => {
  it.todo('timeZone editors should have correct options');
  it.todo('timeZone editor should have correct display value for timezones with different offsets');
  it.todo('dataSource of timezoneEditor should be filtered');
});
