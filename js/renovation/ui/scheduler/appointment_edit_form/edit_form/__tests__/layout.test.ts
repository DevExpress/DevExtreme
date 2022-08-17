/* eslint-disable @typescript-eslint/no-unused-vars */
import { compileGetter, compileSetter } from '../../../../../../core/utils/data';
import { DataAccessorType } from '../../../types';
import { DescriptionEditor } from '../editors/descriptionEditor';
import { EndDateEditor } from '../editors/endDateEditor';
import { StartDateEditor } from '../editors/startDateEditor';
import { SwitchEditor } from '../editors/switchEditor';
import { TimeZoneEditor } from '../editors/timeZoneEditor';
import { EditForm, EditFormProps } from '../layout';

const getFormLayoutConfigMock = jest.fn((...args) => 'form items');
jest.mock('../layout_items/formLayout', () => ({
  ...jest.requireActual('../layout_items/formLayout'),
  getFormLayoutConfig: jest.fn((...args) => getFormLayoutConfigMock(args)),
}));

describe('Init', () => {
  it('should have correct default template props', () => {
    const editFormProps = new EditFormProps();

    expect(editFormProps.startDateEditorTemplate)
      .toBe(StartDateEditor);

    expect(editFormProps.endDateEditorTemplate)
      .toBe(EndDateEditor);

    expect(editFormProps.timeZoneEditorTemplate)
      .toBe(TimeZoneEditor);

    expect(editFormProps.allDayEditorTemplate)
      .toBe(SwitchEditor);

    expect(editFormProps.repeatEditorTemplate)
      .toBe(SwitchEditor);

    expect(editFormProps.descriptionEditorTemplate)
      .toBe(DescriptionEditor);
  });
});

describe('Logic', () => {
  describe('Form data value changes', () => {
    it('should correctly change startDate', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedDate = new Date(2022, 5, 15);

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.startDateChange(expectedDate);

      expect(editForm.formContextValue.formData.startDate)
        .toEqual(expectedDate);
    });

    it('should correctly change endDate', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedDate = new Date(2022, 5, 15);

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.endDateChange(expectedDate);

      expect(editForm.formContextValue.formData.endDate)
        .toEqual(expectedDate);
    });

    it('should correctly change startDateTimeZoneChange', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedTimeZone = 'Russia / Moscow';

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.startDateTimeZoneChange(expectedTimeZone);

      expect(editForm.formContextValue.formData.startDateTimeZone)
        .toEqual(expectedTimeZone);
    });

    it('should correctly change endDateTimeZoneChange', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedTimeZone = 'Russia / Moscow';

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.endDateTimeZoneChange(expectedTimeZone);

      expect(editForm.formContextValue.formData.endDateTimeZone)
        .toEqual(expectedTimeZone);
    });

    it('should correctly change allDay', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedAllDay = true;

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.allDayChange(expectedAllDay);

      expect(editForm.isAllDay)
        .toEqual(expectedAllDay);
      expect(editForm.formContextValue.formData.allDay)
        .toEqual(expectedAllDay);
    });

    it('should correctly change repeat', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedRepeat = true;

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.repeatChange(expectedRepeat);

      expect(editForm.formContextValue.formData.repeat)
        .toEqual(expectedRepeat);
    });

    it('should correctly change description', () => {
      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData: {
          text: 'some text',
        } as any,
      } as any);

      const expectedDescription = 'Some description';

      editForm.formContextValue = {
        formData: {},
      } as any;
      editForm.descriptionChange(expectedDescription);

      expect(editForm.formContextValue.formData.description)
        .toEqual(expectedDescription);
    });
  });

  describe('Form items', () => {
    const defaultDataAccessors: DataAccessorType = {
      getter: {
        startDate: compileGetter('startDate') as any,
        endDate: compileGetter('endDate') as any,
        recurrenceRule: compileGetter('recurrenceRule') as any,
        visible: compileGetter('visible') as any,
      },
      setter: {
        startDate: compileSetter('startDate') as any,
        endDate: compileSetter('endDate') as any,
      },
      expr: {
        startDateExpr: 'startDate',
        endDateExpr: 'endDate',
        recurrenceRuleExpr: 'recurrenceRule',
        visibleExpr: 'visible',
      } as any,
    };

    it('should be correctly generated', () => {
      const appointmentData = {
        text: 'some text',
        startDate: new Date(2022, 5, 15, 8),
        endDate: new Date(2022, 5, 15, 9),
        startDateTimeZone: 'Russia / Moscow',
        endDateTimeZone: 'Russia / Vladivostok',
        description: 'description',
      } as any;

      const formData = {
        startDate: new Date(2022, 5, 15, 10),
        endDate: new Date(2022, 5, 15, 11),
        startDateTimeZone: 'Russia / Moscow',
        endDateTimeZone: 'Russia / Moscow',
        allDay: true,
        repeat: true,
        recurrenceRule: 'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO',
        description: 'Some description',
      };

      const editForm = new EditForm({
        allowUpdating: true,
        appointmentData,
        dataAccessors: defaultDataAccessors,
        allowTimeZoneEditing: true,
        startDateEditorTemplate: 'StartDateEditor',
        endDateEditorTemplate: 'EndDateEditor',
        timeZoneEditorTemplate: 'TimeZoneEditor',
        allDayEditorTemplate: 'SwitchEditor',
        repeatEditorTemplate: 'SwitchEditor',
        descriptionEditorTemplate: 'DescriptionEditor',
        firstDayOfWeek: 5,
      } as any);

      editForm.formContextValue = {
        formData,
      };

      editForm.isAllDay = true;

      expect(editForm.formItems)
        .toEqual('form items');

      expect(getFormLayoutConfigMock)
        .toBeCalledTimes(1);
    });
  });
});
