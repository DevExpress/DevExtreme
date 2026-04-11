import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from '../__tests__/__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from '../__tests__/__mock__/m_mock_scheduler';

const defaultData = [
  {
    text: 'recurrent-app',
    startDate: new Date(2017, 4, 1, 9, 30),
    endDate: new Date(2017, 4, 1, 11),
    recurrenceRule: 'FREQ=DAILY;COUNT=5',
  }, {
    text: 'common-app',
    startDate: new Date(2017, 4, 9, 9, 30),
    endDate: new Date(2017, 4, 9, 11),
  },
];

const defaultOption = {
  dataSource: defaultData,
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
  firstDayOfWeek: 1,
  startDayHour: 9,
  height: 600,
  width: 600,
};

describe('Appointment popup form', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('Original appointment\'s fields shouldn\'t fill if used fieldExpr', async () => {
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

    POM.popup.getDoneButton().click();

    expect(newAppointment?.[textExpValue]).toBe('qwerty');
    expect(newAppointment?.text).toBeUndefined();

    expect(data[0].Subject).toBe('qwerty');
    expect(data[0].text).toBeUndefined();
  });

  it('Recurrence form should work properly if recurrenceRule property mapped recurrenceRuleExpr', async () => {
    const { scheduler, POM } = await createScheduler({
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

    const { value: repeatInputRecurrence } = POM.popup.getSwitchByName('repeat');

    scheduler.hideAppointmentPopup();
    scheduler.showAppointmentPopup();

    const { value: repeatInput } = POM.popup.getSwitchByName('repeat');

    expect(repeatInputRecurrence).toBe('true');
    expect(repeatInput).toBe('false');
  });

  it('showAppointmentPopup method should be work properly with no argument: baseOptions', async () => {
    const { scheduler, POM } = await createScheduler({
      currentDate: new Date(2017, 4, 1),
      views: ['month'],
      currentView: 'month',
    });

    scheduler.option('dataSource', []);
    await new Promise(process.nextTick);

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Subject', 'app');
    POM.popup.setInputValueByLabel('Start Date', '05/01/2017, 01:30 PM');
    POM.popup.setInputValueByLabel('End Date', '05/01/2017, 03:00 PM');

    POM.popup.getDoneButton().click();

    const app = POM.getAppointment('app');

    expect(app.getText()).toBe('app');
    expect(app.getDisplayDate()).toBe('1:30 PM - 3:00 PM');
  });

  it('showAppointmentPopup method should be work properly with no argument: cancelButton', async () => {
    const { scheduler, POM } = await createScheduler(undefined);

    scheduler.option('dataSource', []);
    await new Promise(process.nextTick);

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Subject', 'app');
    POM.popup.setInputValueByLabel('Start Date', '05/01/2017, 01:30 PM');
    POM.popup.setInputValueByLabel('End Date', '05/01/2017, 03:00 PM');

    POM.popup.getCancelButton().click();

    const appointments = POM.getAppointments();

    expect(appointments.length).toBe(0);
  });

  it('showAppointmentPopup method should be work properly with no argument: all day appointments', async () => {
    const { scheduler, POM } = await createScheduler({
      views: ['month'],
      currentView: 'month',
    });

    scheduler.option('dataSource', []);
    await new Promise(process.nextTick);

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Subject', 'app');
    POM.popup.setInputValueByLabel('Start Date', '05/01/2017, 01:30 PM');
    POM.popup.setInputValueByLabel('End Date', '05/01/2017, 03:00 PM');
    POM.popup.getSwitchByName('repeat').click();

    await new Promise(process.nextTick);

    POM.popup.getDoneButton().click();

    const appointments = POM.getAppointments();

    expect(appointments.length).toBe(2);
  });

  it.todo('Appointment popup form should have two named groups');

  it('Appointment popup should be with correct dates after chage allDay switch and w/o saving (T832711)', async () => {
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

  it('onAppointmentFormOpening event should pass e.popup argument', async () => {
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

  it('onAppointmentFormOpening event should handle e.cancel value: default settings', async () => {
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

  it('onAppointmentFormOpening event should handle e.cancel value: true', async () => {
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

  it('onAppointmentFormOpening event should handle e.cancel value: false', async () => {
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

  it('Appointment popup shouldn\'t render recurrence editor, if previous was with recurrence', async () => {
    setupSchedulerTestEnvironment({ height: 200 });
    const { POM } = await createScheduler({
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

    expect(POM.popup.getSwitchByName('repeat').value).toBe('true');
    expect(POM.popup.getInputByLabel('Subject').value).toBe('recurrent-app');

    jest.useFakeTimers();

    POM.popup.getCancelButton().click();

    jest.runAllTimers();

    POM.openPopupByDblClick('common-app');

    expect(POM.popup.getSwitchByName('repeat').value).toBe('false');
    expect(POM.popup.getInputByLabel('Subject').value).toBe('common-app');
  });

  it('Appointment popup should work properly', async () => {
    const NEW_EXPECTED_SUBJECT = 'NEW SUBJECT';
    setupSchedulerTestEnvironment({ height: 200 });
    const { scheduler, POM } = await createScheduler(defaultOption);

    expect(POM.getPopups().length).toBe(0);

    jest.useFakeTimers();
    const appointment = POM.getAppointment('common-app');
    if (appointment?.element) {
      appointment.element.click();
    } else {
      throw new Error('Appointment "common-app" not found or has no element');
    }
    jest.runAllTimers();

    POM.getTooltipAppointment()?.click();

    POM.popup.setInputValueByLabel('Subject', NEW_EXPECTED_SUBJECT);
    expect(POM.popup.getInputByLabel('Subject').value).toBe(NEW_EXPECTED_SUBJECT);
    expect(POM.getPopups().length).toBe(1);
    POM.popup.getDoneButton().click();

    const dataSource = scheduler.option('dataSource');
    const dataItem = dataSource ? dataSource[1] : null;
    expect(Object.keys(dataItem).length).toBe(3);
    expect(dataItem.text).toBe(NEW_EXPECTED_SUBJECT);

    const appointmentR = POM.getAppointment('recurrent-app');
    if (appointmentR?.element) {
      appointmentR.element.click();
    } else {
      throw new Error('Appointment "recurrent-app" not found or has no element');
    }
    jest.runAllTimers();
    POM.getTooltipAppointment()?.click();

    POM.popup.getEditSeriesButton().click();

    expect(POM.popup.getSwitchByName('repeat').value).toBe('true');
    expect(POM.popup.getInputByLabel('Subject').value).toBe('recurrent-app');
  });

  it('Recurrence repeat-end editor should have default \'never\' value after reopening appointment popup', async () => {
    const firstAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 1' };
    const secondAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: 'caption 2' };
    const { POM, scheduler } = await createScheduler(defaultOption);

    scheduler.showAppointmentPopup(firstAppointment);
    POM.popup.getSwitchByName('repeat').click();

    POM.popup.selectRadio('After');

    POM.popup.getDoneButton().click();

    scheduler.showAppointmentPopup(secondAppointment);
    POM.popup.getSwitchByName('repeat').click();

    const radioValue = POM.popup.getSelectedRadioValue();

    expect(radioValue).toBe('Never');
  });

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
    POM.popup.getDoneButton().click();
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

    POM.popup.getDoneButton().click();
    const loadPanel = POM.getLoadPanel();
    expect(loadPanel).toBeTruthy();
    await new Promise(process.nextTick);
    const loadPanelAfter = POM.getLoadPanel();
    expect(loadPanelAfter).toBeFalsy();
    expect(fn).toBeCalled();
  });

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

    POM.popup.getDoneButton().click();
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

    POM.popup.getDoneButton().click();
    const loadPanel = POM.getLoadPanel();
    expect(loadPanel).toBeFalsy();

    await new Promise(process.nextTick);

    const appointment = POM.getAppointment('New Subject');

    expect(appointment.getText()).toEqual('New Subject');
  });

  it('onAppointmentAdding and e.cancel=true', async () => {
    const { scheduler, POM } = await createScheduler({
      views: ['day'],
      dataSource: [],
      currentDate: new Date(2015, 4, 24),
      startDayHour: 8,
      endDayHour: 18,
      onAppointmentAdding: (e: { cancel: boolean }) => { e.cancel = true; },
    });

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Start Date', '05/24/2015, 9:00 AM');
    POM.popup.setInputValueByLabel('End Date', '05/24/2015, 11:00 AM');
    POM.popup.setInputValueByLabel('Subject', 'New Subject');

    POM.popup.getDoneButton().click();

    const loadPanel = POM.getLoadPanel();
    expect(loadPanel).toBeFalsy();

    await new Promise(process.nextTick);

    const appointments = POM.getAppointments();

    expect(appointments.length).toBe(0);
  });

  it('onAppointmentAdding and e.cancel=false', async () => {
    const { scheduler, POM } = await createScheduler({
      views: ['day'],
      dataSource: [],
      currentDate: new Date(2015, 4, 24),
      startDayHour: 8,
      endDayHour: 18,
      onAppointmentAdding: (e: { cancel: boolean }) => { e.cancel = false; },
    });

    scheduler.showAppointmentPopup();

    POM.popup.setInputValueByLabel('Start Date', '05/24/2015, 9:00 AM');
    POM.popup.setInputValueByLabel('End Date', '05/24/2015, 11:00 AM');
    POM.popup.setInputValueByLabel('Subject', 'New Subject');

    POM.popup.getDoneButton().click();

    const loadPanel = POM.getLoadPanel();
    expect(loadPanel).toBeFalsy();

    await new Promise(process.nextTick);

    const appointment = POM.getAppointment();

    expect(appointment.getText()).toEqual('New Subject');
  });

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

  describe('toolbar', () => {
    const data = [{
      text: 'Website Re-Design Plan',
      startDate: new Date(2017, 4, 22, 9, 30),
      endDate: new Date(2017, 4, 22, 11, 30),
      disabled: true,
    }, {
      text: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date(2017, 4, 22, 12, 0),
      endDate: new Date(2017, 4, 22, 13, 0),
    }];

    it('done button visibility in case allowUpdatingValue = true', async () => {
      const { POM } = await createScheduler({
        dataSource: data,
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 25),
        editing: {
          allowUpdating: true,
        },
      });

      POM.openPopupByDblClick('Website Re-Design Plan');
      const doneButton = POM.popup.getDoneButton();
      expect(doneButton.getAttribute('aria-label')).toBe('Done');
      await new Promise(process.nextTick);
      POM.popup.getCancelButton().click();
    });

    it('done button visibility in case allowUpdatingValue = false', async () => {
      const { POM } = await createScheduler({
        dataSource: data,
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 25),
        editing: {
          allowUpdating: false,
        },
      });

      POM.openPopupByDblClick('Website Re-Design Plan');
      expect(() => POM.popup.getDoneButton()).toThrow('Done button not found');
      POM.popup.getCancelButton().click();
    });

    it('toolbar should be re-rendered after change editing option', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 25),
        editing: {
          allowUpdating: true,
        },
      });

      const dataObj = {
        text: 'a',
        startDate: new Date(2015, 5, 15, 10),
        endDate: new Date(2015, 5, 15, 11),
      };
      scheduler.showAppointmentPopup(dataObj);
      let doneButton = POM.popup.getDoneButton();
      expect(doneButton.getAttribute('aria-label')).toBe('Done');

      scheduler.option('editing', { allowUpdating: false });
      scheduler.showAppointmentPopup(dataObj);

      expect(() => POM.popup.getDoneButton()).toThrow('Done button not found');

      scheduler.showAppointmentPopup();
      doneButton = POM.popup.getDoneButton();
      expect(doneButton.getAttribute('aria-label')).toBe('Done');
    });

    it('(T1308870): startDate popup toolbar items should remain visible when allDay and repeat switches are toggled', async () => {
      const { scheduler } = await createScheduler({
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 25),
      });

      scheduler.showAppointmentPopup();

      const appointmentForm = scheduler.appointmentForm.dxForm;
      const startDate = appointmentForm.getEditor('startDate');
      const toolbarItemsBefore = startDate._getPopupToolbarItems();

      const allDay = appointmentForm.getEditor('allDay');
      allDay.option('value', true);

      const repeat = appointmentForm.getEditor('repeat');
      repeat.option('value', true);

      const startDateAfter = appointmentForm.getEditor('startDate');
      const toolbarItemsAfter = startDateAfter._getPopupToolbarItems();

      expect(toolbarItemsBefore.length).toBe(3);
      expect(toolbarItemsAfter.length).toBe(3);
    });
  });

  describe('Appointment Popup and Recurrence Editor visibility', () => {
    it.todo('Recurrence editor container should be visible if recurrence rule was set');
    it.todo('Recurrence editor container should be visible after changing its visibility value');
    it.todo('Popup should show or not show reccurence editor after many opening with different data');
    it.todo('Popup should show or not to show reccurence editor after many opening with and change visibility');
    it.todo('Popup should not contain recurrence editor, if recurrenceRuleExpr is null');
    it.todo('Popup should not contain recurrence editor, if recurrenceRuleExpr is \'\'');
    it.todo('Multiple showing appointment popup for recurrence appointments and after update options should work correct');
  });

  it('recurrence editors with hidden outer label must have editorOptions.labelMode set to hidden (T1318550)', () => {
    const flattenBy = <T>(
      items: T[],
      getChildren: (item: T) => T[] | undefined,
    ): T[] => items.flatMap((item) => {
        const children = getChildren(item);
        return children?.length ? flattenBy(children, getChildren) : [item];
      });

    const $container = $('<div>').appendTo(document.body);
    const editor = ($container as any).dxRecurrenceEditor({
      value: 'FREQ=DAILY;COUNT=5',
    }).dxRecurrenceEditor('instance');

    const recurrenceForm = editor.getRecurrenceForm();
    const allItems = flattenBy(
      recurrenceForm.option('items') as any[],
      (i: any) => i.items,
    );

    const missingLabelMode = allItems
      .filter((i: any) => i.label?.visible === false && i.editorOptions)
      .filter((i: any) => i.editorOptions.labelMode !== 'hidden');

    expect(missingLabelMode.length).toEqual(0);
  });
});

describe('Appointment Popup Content', () => {
  it.todo('appointmentPopup should not prevent mouse/touch events by default (T968188)');
  it.todo('showAppointmentPopup method with passed a recurrence appointment should render popup(T698732)');
  it.todo('showAppointmentPopup should render a popup only once');
  it.todo('showAppointmentPopup should work correctly after scheduler repainting');
  it.todo('changing editing should work correctly after showing popup');
  it.todo('hideAppointmentPopup should hide a popup');
  it.todo('hideAppointmentPopup should hide a popup and save changes');
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
  it.todo('startDateBox & endDateBox should have required validation rules');
  it.todo('Changes shouldn\'t be saved if form is invalid');
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
  it.todo('Popup should not be closed until the valid value is typed');
});

describe('Timezone Editors', () => {
  it.todo('Popup should not contain startDateTimeZone editor by default');
  it.todo('Popup should not contain endDateTimeZone editor by default');
  it.todo('It should be possible to render startDateTimeZone editor on appt form');
  it.todo('It should be possible to render endDateTimeZone editor on appt form');
  it.todo('timeZone editors should have correct options');
  it.todo('timeZone editors should have correct value & display value on init');
  it.todo('timeZone editor should have correct display value for timezones with different offsets');
  it.todo('dataSource of timezoneEditor should be filtered');
  it.todo('startDateTimeZone and endDateTimeZone editor should be rendered with allowTimeZoneEditing option');
  it.todo('Change value in startDateTimeZone editor should trigger change value in endDateTimeZone editor if allowTimeZoneEditing: true');
  it.todo('Change value in endDateTimeZone editor shouldn\'t trigger change value in startDateTimeZone editor if allowTimeZoneEditing: true');
});
