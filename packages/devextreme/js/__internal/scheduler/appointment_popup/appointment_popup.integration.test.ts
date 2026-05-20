import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import dateLocalization from '@js/common/core/localization/date';
import { CustomStore } from '@js/common/data/custom_store';
import $ from '@js/core/renderer';
import { loadMessages, locale } from '@js/localization';
import type { GroupItem, Item as FormItem, SimpleItem } from '@js/ui/form';
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
    it('should update appointment on save button click', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({
        ...commonAppointment,
        text: 'New Subject',
      });
    });

    it('should not update appointment on cancel button click', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      POM.popup.cancelButton.click();

      expect(dataSource.items()[0]).toMatchObject(commonAppointment);
    });

    it('should update recurring appointment on save button click in recurrence form', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);

      POM.popup.editSeriesButton.click();
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      POM.popup.recurrenceSettingsButton.click();
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({
        ...recurringAppointment,
        text: 'New Subject',
      });
    });

    it('should not update recurring appointment on cancel button click in recurrence form', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.editSeriesButton.click();
      POM.popup.setInputValue('subjectEditor', 'New Subject');
      POM.popup.recurrenceSettingsButton.click();
      POM.popup.cancelButton.click();

      expect(dataSource.items()[0]).toMatchObject(recurringAppointment);
    });

    it('should update appointment recurrence rule changes on save button click', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.selectRepeatValue('daily');
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({
        ...commonAppointment,
        recurrenceRule: 'FREQ=DAILY',
      });
    });

    it('should not update appointment recurrence rule changes on cancel button click', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...commonAppointment }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.selectRepeatValue('daily');
      POM.popup.cancelButton.click();

      expect(dataSource.items()[0]).toMatchObject(commonAppointment);
    });

    it('should not update recurrence rule on save button click if recurrence rule was not changed', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment }],
      });

      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.editSeriesButton.click();
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject(recurringAppointment);
    });

    it('should update recurrence rule on save button click if repeat editor value was set to never', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment }],
      });

      const dataSource = (scheduler as any).getDataSource();
      const item = dataSource.items()[0];

      scheduler.showAppointmentPopup(item);
      POM.popup.editSeriesButton.click();
      POM.popup.selectRepeatValue('never');
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(dataSource.items()[0]).toMatchObject({
        ...recurringAppointment,
        recurrenceRule: '',
      });
    });

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
    it.each([
      'startDateEditor', 'startTimeEditor', 'endDateEditor', 'endTimeEditor',
    ])('should not close popup on save button click when %s is empty', async (editorName) => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({ ...commonAppointment });

      POM.popup.setInputValue(editorName, null);
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(POM.isPopupVisible()).toBe(true);
    });

    it.each([
      'startTimeEditor', 'endDateEditor', 'endTimeEditor',
    ])('should not close popup on save button click in recurrence form when %s editor is empty', async (editorName) => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({ ...commonAppointment });

      POM.popup.setInputValue(editorName, null);
      POM.popup.selectRepeatValue('daily');
      POM.popup.saveButton.click();
      await Promise.resolve();

      expect(POM.isPopupVisible()).toBe(true);
    });

    it('should close popup on save button click in recurrence form when startEditor editor is empty', async () => {
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
    it('should create a new form instance on each popup opening', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      const firstFormInstance = POM.popup.dxForm;

      POM.popup.cancelButton.click();

      scheduler.showAppointmentPopup(commonAppointment);
      const secondFormInstance = POM.popup.dxForm;

      expect(secondFormInstance).not.toBe(firstFormInstance);
    });

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

    it('should update endDate when startDate is changed to a value greater than endDate', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });

      POM.popup.setInputValue('startDateEditor', new Date(2017, 4, 10));

      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/10/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should update endDate when startTime is changed to a value greater than endDate time', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });

      POM.popup.setInputValue('startTimeEditor', new Date(2017, 4, 9, 12));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('1:30 PM');
    });

    it('should update startDate when endDate is changed to a value less than startDate', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });

      POM.popup.setInputValue('endDateEditor', new Date(2017, 4, 8));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/8/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should update startDate when endTime is changed to a value less than startDate time', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });
      POM.popup.setInputValue('endTimeEditor', new Date(2017, 4, 9, 9, 0));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('7:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/9/2017');
    });

    it('should not update endDate when startDate is changed to a value less than endDate', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });
      POM.popup.setInputValue('startDateEditor', new Date(2017, 4, 8));

      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update endDate when startTime is changed to a value less than endDate time', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });
      POM.popup.setInputValue('startTimeEditor', new Date(2017, 4, 9, 10, 0));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update startDate when endDate is changed to a value greater than startDate', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });
      POM.popup.setInputValue('endDateEditor', new Date(2017, 4, 10));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.popup.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update startDate when endTime is changed to a value greater than startDate time', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup({
        text: 'test app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      });
      POM.popup.setInputValue('endTimeEditor', new Date(2017, 4, 9, 12));

      expect(POM.popup.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.popup.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.popup.getInputValue('endDateEditor')).toEqual('5/9/2017');
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
    it('should be turned on when opening allDay appointment', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(allDayAppointment);

      expect(POM.popup.getInputValue('allDayEditor')).toBe('true');
    });

    it('should be turned off when opening non-allDay appointment', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.getInputValue('allDayEditor')).toBe('false');
    });

    it('should hide time editors when switched on', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.popup.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeTruthy();

      POM.popup.getInput('allDayEditor').click();

      expect(POM.popup.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();
    });

    it('should show time editors when switched off', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(allDayAppointment);

      expect(POM.popup.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();

      POM.popup.getInput('allDayEditor').click();

      expect(POM.popup.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeTruthy();
    });

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

    it('should set correct dates when switching off then on in day view', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        currentView: 'day',
      });

      scheduler.showAppointmentPopup(allDayAppointment);

      POM.popup.getInput('allDayEditor').click();
      POM.popup.getInput('allDayEditor').click();

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

      POM.popup.getInput('allDayEditor').click();
      POM.popup.getInput('allDayEditor').click();

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

      POM.popup.getInput('allDayEditor').click();
      POM.popup.getInput('allDayEditor').click();

      expect(POM.popup.getInputValue('startDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.popup.getInputValue('endDateEditor')).toBe('5/1/2017');
      expect(POM.popup.isInputVisible('endTimeEditor')).toBeFalsy();
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
    it('should have correct resource editor value', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          roomId: 2,
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
      expect(POM.popup.getInputValue('roomId')).toBe('Room 2');
    });

    it('should create resourceEditorsGroup when resources have no custom icons', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        resources: [
          { fieldExpr: 'roomId' },
          { fieldExpr: 'ownerId' },
        ],
      });

      scheduler.showAppointmentPopup();

      const resourcesGroup = POM.popup.dxForm.itemOption('mainGroup.resourcesGroup') as GroupItem;

      expect(resourcesGroup).toBeDefined();
      expect(resourcesGroup?.items?.length).toBe(2);

      expect(resourcesGroup?.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'resourcesGroupIcon',
          }),
          expect.objectContaining({
            name: 'resourceEditorsGroup',
            itemType: 'group',
            items: expect.arrayContaining([
              expect.objectContaining({
                name: 'roomIdEditor',
              }),
              expect.objectContaining({
                name: 'ownerIdEditor',
              }),
            ]),
          }),
        ]),
      );
    });

    it('should create individual resource groups when resources have custom icons', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        resources: [
          { fieldExpr: 'roomId', icon: 'home' },
          { fieldExpr: 'ownerId', icon: 'user' },
        ],
      });

      scheduler.showAppointmentPopup();

      const resourcesGroup = POM.popup.dxForm.itemOption('mainGroup.resourcesGroup') as GroupItem;

      expect(resourcesGroup).toBeDefined();
      expect(resourcesGroup?.items?.length).toBe(2);

      expect(resourcesGroup?.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'roomIdGroup',
            itemType: 'group',
            items: expect.arrayContaining([
              expect.objectContaining({
                name: 'roomIdIcon',
              }),
              expect.objectContaining({
                name: 'roomIdEditor',
              }),
            ]),
          }),
          expect.objectContaining({
            name: 'ownerIdGroup',
            itemType: 'group',
            items: expect.arrayContaining([
              expect.objectContaining({
                name: 'ownerIdIcon',
              }),
              expect.objectContaining({
                name: 'ownerIdEditor',
              }),
            ]),
          }),
        ]),
      );
    });

    it('should render FontAwesome icon with correct CSS classes (T1322161)', async () => {
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
          icon: 'fas fa-home',
          dataSource: [{ text: 'Room 1', id: 1 }, { text: 'Room 2', id: 2 }],
        }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      scheduler.showAppointmentPopup(appointment);

      const { resourceIcon } = POM.popup;

      expect(resourceIcon.classList.contains('fas')).toBe(true);
      expect(resourceIcon.classList.contains('fa-home')).toBe(true);
    });

    it('should create dxTagBox for resource with multiple selection', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          ownerId: [1, 2],
        }],
        resources: [{
          fieldExpr: 'ownerId',
          allowMultiple: true,
          dataSource: [{ text: 'Owner 1', id: 1 }, { text: 'Owner 2', id: 2 }, { text: 'Owner 3', id: 3 }],
        }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      scheduler.showAppointmentPopup(appointment);

      const resourceEditor = POM.popup.dxForm.getEditor('ownerId') as any;
      expect(resourceEditor.NAME).toBe('dxTagBox');
      expect(resourceEditor.option('value')).toEqual([1, 2]);
    });

    it('should create dxSelectBox for resource with single selection', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{
          text: 'Resource test app',
          startDate: new Date(2017, 4, 9, 9, 30),
          endDate: new Date(2017, 4, 9, 11),
          ownerId: 2,
        }],
        resources: [{
          fieldExpr: 'ownerId',
          allowMultiple: false,
          dataSource: [{ text: 'Owner 1', id: 1 }, { text: 'Owner 2', id: 2 }, { text: 'Owner 3', id: 3 }],
        }],
      });
      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      scheduler.showAppointmentPopup(appointment);

      const resourceEditor = POM.popup.dxForm.getEditor('ownerId') as any;
      expect(resourceEditor.NAME).toBe('dxSelectBox');
      expect(resourceEditor.option('value')).toEqual(2);
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

  describe('Recurrence Form', () => {
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

      POM.popup.recurrenceSettingsButton.click();

      expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);
    });

    it('should close repeat selectbox popup when navigating to recurrence group via settings button', async () => {
      const { POM, scheduler } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment }],
      });

      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      scheduler.showAppointmentPopup(appointment);
      POM.popup.editSeriesButton.click();

      const repeatEditor = POM.popup.dxForm.getEditor('repeatEditor');
      POM.popup.getInput('repeatEditor').click();

      expect(repeatEditor?.option('opened')).toBe(true);

      POM.popup.recurrenceSettingsButton.click();

      expect(repeatEditor?.option('opened')).toBe(false);
    });

    it('should have disabled week day buttons when allowUpdating is false', async () => {
      const { POM, scheduler } = await createScheduler({
        ...getDefaultConfig(),
        dataSource: [{ ...recurringAppointment, recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE,TU,TH,FR,SA' }],
        editing: { allowUpdating: false },
      });

      const dataSource = (scheduler as any).getDataSource();
      const appointment = dataSource.items()[0];

      scheduler.showAppointmentPopup(appointment);
      POM.popup.recurrenceSettingsButton.click();

      const weekDayButtons = $(POM.popup.recurrenceWeekDayButtons);
      const disabledButtons = weekDayButtons?.find('.dx-button.dx-state-disabled');

      expect(disabledButtons.length).toBe(7);
    });

    it('should be visible after changing repeat editor\'s value', async () => {
      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup();

      expect(POM.popup.isMainGroupVisible()).toBe(true);
      expect(POM.popup.mainGroup.getAttribute('inert')).toBeNull();
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
      expect(POM.popup.recurrenceGroup.getAttribute('inert')).toBe('true');

      POM.popup.selectRepeatValue('weekly');

      const popupHeight = POM.popup.component.option('height');
      expect(popupHeight).toBeDefined();
      expect(typeof popupHeight).toBe('number');

      expect(POM.popup.isMainGroupVisible()).toBe(false);
      expect(POM.popup.mainGroup.getAttribute('inert')).toBe('true');
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);
      expect(POM.popup.recurrenceGroup.getAttribute('inert')).toBeNull();

      POM.popup.backButton.click();

      expect(POM.popup.component.option('height')).toBe('auto');
      expect(POM.popup.isMainGroupVisible()).toBe(true);
      expect(POM.popup.mainGroup.getAttribute('inert')).toBeNull();
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
      expect(POM.popup.recurrenceGroup.getAttribute('inert')).toBe('true');
    });

    it('should open main form when opening recurring appointment', async () => {
      const appointment = {
        text: 'Recurrent Appointment',
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      };

      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(appointment);

      POM.popup.editSeriesButton.click();

      expect(POM.popup.isMainGroupVisible()).toBe(true);
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(false);
    });

    describe('State', () => {
      it('should have correct input values for appointment with hour frequency', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=HOURLY;INTERVAL=2;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();

        expect(POM.popup.getInputValue('repeatEditor')).toBe('Hourly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.popup.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Hour(s)');
        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with daily frequency', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();

        expect(POM.popup.getInputValue('repeatEditor')).toBe('Daily');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.popup.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Day(s)');
        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with week frequency', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();

        expect(POM.popup.getInputValue('repeatEditor')).toBe('Weekly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.popup.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Week(s)');

        const expectedWeekDaysSelection = [true, false, true, false, true, false, false];
        expect(POM.popup.getWeekDaysSelection()).toEqual(expectedWeekDaysSelection);

        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with monthly frequency', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=1;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();

        expect(POM.popup.getInputValue('repeatEditor')).toBe('Monthly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.popup.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Month(s)');
        expect(POM.popup.getInputValue('recurrenceDayOfMonthEditor')).toBe('1');
        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with yearly frequency', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=YEARLY;INTERVAL=2;BYMONTHDAY=1;BYMONTH=5;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();

        expect(POM.popup.getInputValue('repeatEditor')).toBe('Yearly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.popup.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Year(s)');
        expect(POM.popup.getInputValue('recurrenceDayOfYearDayEditor')).toBe('1');
        expect(POM.popup.getInputValue('recurrenceDayOfYearMonthEditor')).toBe('May');
        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('T1325870: should use current locale for recurrence editors after locale change', async () => {
        const currentLocale = locale();

        loadMessages({
          de: {
            'dxScheduler-recurrenceYearly': 'custom yearly',
            'dxScheduler-recurrenceRepeatYearly': 'custom repeat yearly',
          },
        });
        locale('de');

        try {
          const { scheduler, POM } = await createScheduler(getDefaultConfig());

          scheduler.showAppointmentPopup({
            text: 'Meeting',
            startDate: new Date(2017, 4, 1, 10, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: 'FREQ=YEARLY;INTERVAL=2;BYMONTHDAY=1;BYMONTH=5;COUNT=10',
            repeatEnd: 'count',
          });
          POM.popup.editSeriesButton.click();

          expect(POM.popup.getInputValue('repeatEditor')).toBe('custom yearly');

          POM.popup.recurrenceSettingsButton.click();

          expect(POM.popup.getInputValue('recurrencePeriodEditor')).toBe('Custom repeat yearly');
          expect(POM.popup.getInputValue('recurrenceDayOfYearMonthEditor')).toBe(dateLocalization.getMonthNames()[4]);
        } finally {
          locale(currentLocale);
        }
      });

      it('should have correct input values for appointment with no end', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2',
          repeatEnd: 'never',
        });
        POM.popup.editSeriesButton.click();
        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceRepeatEndEditor')).toBe('never');
      });

      it('should have correct input values for appointment with end by date', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2;UNTIL=20170601T000000Z',
          repeatEnd: 'until',
        });
        POM.popup.editSeriesButton.click();
        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceRepeatEndEditor')).toBe('until');
        expect(POM.popup.getInputValue('recurrenceEndUntilEditor')).toBe('6/1/2017');
      });

      it('should have correct input values for appointment with end by count', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
          recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=10',
          repeatEnd: 'count',
        });
        POM.popup.editSeriesButton.click();
        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceRepeatEndEditor')).toBe('count');
        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });
    });

    describe('Repeat End Values Preservation', () => {
      it('should preserve count value when switching between recurrence types', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());
        const testCount = 15;

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
        });

        POM.popup.selectRepeatValue('daily');

        POM.popup.setInputValue('recurrenceRepeatEndEditor', 'count');
        POM.popup.setInputValue('recurrenceEndCountEditor', testCount);

        POM.popup.backButton.click();

        POM.popup.selectRepeatValue('weekly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceEndCountEditor')).toBe(`${testCount} occurrence(s)`);

        scheduler.hideAppointmentPopup();
      });

      it('should preserve until value when switching between recurrence types', async () => {
        const { scheduler, POM } = await createScheduler(getDefaultConfig());
        const testUntilDate = new Date(2017, 5, 16);

        scheduler.showAppointmentPopup({
          text: 'Meeting',
          startDate: new Date(2017, 4, 1, 10, 30),
          endDate: new Date(2017, 4, 1, 11),
        });

        POM.popup.selectRepeatValue('daily');

        POM.popup.setInputValue('recurrenceRepeatEndEditor', 'until');
        POM.popup.setInputValue('recurrenceEndUntilEditor', testUntilDate);

        POM.popup.backButton.click();

        POM.popup.selectRepeatValue('weekly');

        POM.popup.recurrenceSettingsButton.click();

        expect(POM.popup.getInputValue('recurrenceEndUntilEditor')).toBe('6/16/2017');

        scheduler.hideAppointmentPopup();
      });
    });

    describe('Repeat End Editors Disabled State', () => {
      ['never', 'until', 'count'].forEach((repeatEndValue) => {
        it(`should set correct disabled state when repeatEnd is ${repeatEndValue}`, async () => {
          const { scheduler, POM } = await createScheduler(getDefaultConfig());
          let recurrenceRule = '';
          switch (repeatEndValue) {
            case 'count':
              recurrenceRule = 'FREQ=DAILY;COUNT=10';
              break;
            case 'until':
              recurrenceRule = 'FREQ=DAILY;UNTIL=20170615T000000Z';
              break;
            default:
              recurrenceRule = 'FREQ=DAILY';
          }

          scheduler.showAppointmentPopup({
            text: 'Meeting',
            startDate: new Date(2017, 4, 1, 10, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule,
          });

          POM.popup.editSeriesButton.click();
          POM.popup.recurrenceSettingsButton.click();

          const untilEditor = POM.popup.dxForm.getEditor('recurrenceEndUntilEditor');
          const countEditor = POM.popup.dxForm.getEditor('recurrenceEndCountEditor');

          expect(untilEditor?.option('disabled')).toBe(repeatEndValue !== 'until');
          expect(countEditor?.option('disabled')).toBe(repeatEndValue !== 'count');
        });
      });
    });

    describe('FrequencyEditor focus', () => {
      it('should not be focused when value is changed via API', async () => {
        const { POM, scheduler } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [],
          views: ['week'],
          currentView: 'week',
          currentDate: new Date(2021, 2, 25),
        });

        scheduler.showAppointmentPopup(recurringAppointment);
        POM.popup.editSeriesButton.click();
        POM.popup.recurrenceSettingsButton.click();

        const frequencyEditor = POM.popup.dxForm.getEditor('recurrencePeriodEditor');
        const frequencyEditorInputElement = POM.popup.getInput('recurrencePeriodEditor');

        frequencyEditor?.option('value', 'yearly');

        expect(document.activeElement).not.toBe(frequencyEditorInputElement);
      });

      it('should be focused when value is changed via keyboard', async () => {
        const { POM, scheduler, keydown } = await createScheduler({
          ...getDefaultConfig(),
          dataSource: [],
          views: ['week'],
          currentView: 'week',
          currentDate: new Date(2021, 2, 25),
        });

        scheduler.showAppointmentPopup(recurringAppointment);
        POM.popup.editSeriesButton.click();
        POM.popup.recurrenceSettingsButton.click();

        const frequencyEditorInputElement = POM.popup.getInput('recurrencePeriodEditor');

        frequencyEditorInputElement.click();
        jest.useFakeTimers();
        keydown(frequencyEditorInputElement, 'ArrowDown');
        jest.runAllTimers();

        expect(document.activeElement).toBe(frequencyEditorInputElement);
      });
    });

    it('should set animation offset CSS variable when switching to recurrence form', async () => {
      setupSchedulerTestEnvironment({
        height: 600,
        classRects: {
          'dx-form': { top: 10 },
          'dx-scheduler-form-main-group': { top: 60 },
        },
      });

      const { scheduler, POM } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup();
      POM.popup.selectRepeatValue('weekly');

      const animationTop = POM.popup.dxForm.$element()[0].style.getPropertyValue('--dx-scheduler-animation-top');
      expect(animationTop).toBe('50px');
    });
  });

  it('recurrence editors with hidden outer label must have editorOptions.labelMode set to hidden (T1318550)', async () => {
    const flattenBy = <T>(
      items: T[],
      getChildren: (item: T) => T[] | undefined,
    ): T[] => items.flatMap((item) => {
      const children = getChildren(item);
      return children?.length ? flattenBy(children, getChildren) : [item];
    });

    const { scheduler, POM } = await createScheduler({
      ...getDefaultConfig(),
      dataSource: [{ ...recurringAppointment }],
    });

    scheduler.showAppointmentPopup(commonAppointment);

    const formItems = POM.popup.dxForm.option('items') ?? [];
    const recurrenceGroup = formItems[1] as GroupItem;
    const allItems = flattenBy<SimpleItem>(
      recurrenceGroup.items as SimpleItem[],
      (i) => (i as unknown as GroupItem).items as SimpleItem[] | undefined,
    );

    const missingLabelMode = allItems
      .filter((i) => i.label?.visible === false && i.editorOptions)
      .filter((i) => (i.editorOptions as Record<string, unknown>).labelMode !== 'hidden');

    expect(missingLabelMode.length).toEqual(0);
  });

  describe('firstDayOfWeek', () => {
    beforeEach(() => {
      jest.spyOn(dateLocalization, 'firstDayOfWeekIndex').mockReturnValue(3);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should apply firstDayOfWeek to week day buttons', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const dayButtonsMonday = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
      expect(dayButtonsMonday.text()).toBe('MTWTFSS');

      scheduler.hideAppointmentPopup();
      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const dayButtonsSunday = $(POM.popup.recurrenceWeekDayButtons).find('.dx-button');
      expect(dayButtonsSunday.text()).toBe('SMTWTFS');
    });

    it('should apply firstDayOfWeek to recurrence form startDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const recurrenceStartDateEditor = POM.popup.dxForm.getEditor('recurrenceStartDateEditor');
      expect(recurrenceStartDateEditor).toBeDefined();
      expect(recurrenceStartDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);
      POM.popup.selectRepeatValue('weekly');

      const recurrenceStartDateEditorAfter = POM.popup.dxForm.getEditor('recurrenceStartDateEditor');
      expect(recurrenceStartDateEditorAfter).toBeDefined();
      expect(recurrenceStartDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
    });

    it('should apply firstDayOfWeek to startDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      const startDateEditor = POM.popup.dxForm.getEditor('startDateEditor');
      expect(startDateEditor).toBeDefined();
      expect(startDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);

      const startDateEditorAfter = POM.popup.dxForm.getEditor('startDateEditor');
      expect(startDateEditorAfter).toBeDefined();
      expect(startDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
    });

    it('should apply firstDayOfWeek to endDate calendar', async () => {
      const { POM, scheduler } = await createScheduler(getDefaultConfig());

      scheduler.showAppointmentPopup(commonAppointment);

      const endDateEditor = POM.popup.dxForm.getEditor('endDateEditor');
      expect(endDateEditor).toBeDefined();
      expect(endDateEditor?.option('calendarOptions.firstDayOfWeek')).toBe(1);

      scheduler.option('firstDayOfWeek', 0);

      scheduler.showAppointmentPopup(commonAppointment);

      const endDateEditorAfter = POM.popup.dxForm.getEditor('endDateEditor');
      expect(endDateEditorAfter).toBeDefined();
      expect(endDateEditorAfter?.option('calendarOptions.firstDayOfWeek')).toBe(0);
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

        POM.popup.setInputValue('roomId', 2);
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

  describe('Customization', () => {
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
      const formHeight = form.option('height') as number;
      const elementAttr = form.option('elementAttr') as { class?: string; id?: string };
      const { class: className, id } = elementAttr;

      expect(formHeight).toBe(500);
      expect(className).toBe('dx-scheduler-form');
      expect(id).toBe('custom-form');
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

    it('should call onInitialized callback when popup is initialized', async () => {
      const onInitialized = jest.fn();
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            onInitialized,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.isPopupVisible()).toBe(true);
      expect(onInitialized).toHaveBeenCalled();
      expect(onInitialized).toHaveBeenCalledTimes(1);
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

    it('should open popup if popup.deferRendering is false', async () => {
      const { scheduler, POM } = await createScheduler({
        ...getDefaultConfig(),
        editing: {
          allowAdding: true,
          allowUpdating: true,
          popup: {
            deferRendering: false,
          },
        },
      });

      scheduler.showAppointmentPopup(commonAppointment);

      expect(POM.isPopupVisible()).toBe(true);
    });

    describe('Popup width and maxWidth options', () => {
      // Mock window width to avoid fullscreen mode
      beforeEach(() => {
        Object.defineProperty(document.documentElement, 'clientWidth', {
          value: 1280,
        });
      });

      it('should use custom maxWidth when specified', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: {
            allowAdding: true,
            allowUpdating: true,
            popup: {
              maxWidth: 500,
            },
          },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const maxWidth = POM.popup.component.option('maxWidth');
        expect(maxWidth).toBe(500);
      });

      it('should use custom width as maxWidth when maxWidth is not specified', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: {
            allowAdding: true,
            allowUpdating: true,
            popup: {
              width: 600,
            },
          },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const width = POM.popup.component.option('width');
        expect(width).toBe(600);

        const maxWidth = POM.popup.component.option('maxWidth');
        expect(maxWidth).toBe(600);
      });

      it('should use maxWidth option value (not width) for maxWidth when both maxWidth and width are specified', async () => {
        const { scheduler, POM } = await createScheduler({
          ...getDefaultConfig(),
          editing: {
            allowAdding: true,
            allowUpdating: true,
            popup: {
              width: 600,
              maxWidth: 500,
            },
          },
        });

        scheduler.showAppointmentPopup(commonAppointment);

        const width = POM.popup.component.option('width');
        expect(width).toBe(600);

        const maxWidth = POM.popup.component.option('maxWidth');
        expect(maxWidth).toBe(500);
      });
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

describe('Customize form items', () => {
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      POM.popup.selectRepeatValue('weekly');

      expect(POM.popup.isMainGroupVisible()).toBe(false);
      expect(POM.popup.isRecurrenceGroupVisible()).toBe(true);

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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
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

      const { dxForm: form } = POM.popup;
      const formItems = form.option('items') as FormItem[];
      const mainGroup = formItems?.[0] as any;
      expect(mainGroup?.items?.length).toBe(0);
    });
  });
});
