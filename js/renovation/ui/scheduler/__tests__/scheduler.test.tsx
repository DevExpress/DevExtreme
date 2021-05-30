import { mount } from 'enzyme';
import { SchedulerProps } from '../props';
import { Scheduler, viewFunction } from '../scheduler';
import { Widget } from '../../common/widget';

describe('Scheduler', () => {
  describe('private', () => {
    it('dispose should pass call to instance', () => {
      const scheduler = new Scheduler(new SchedulerProps());
      const dispose = jest.fn();

      scheduler.instance = {
        dispose,
      } as any;

      scheduler.dispose()();

      expect(dispose).toBeCalledTimes(1);
    });

    it('getComponentInstance should pass call to instance', () => {
      const scheduler = new Scheduler(new SchedulerProps());
      const mockInstance = {};

      scheduler.instance = mockInstance as any;
      expect(scheduler.getComponentInstance()).toMatchObject(mockInstance);
    });
  });

  describe('API', () => {
    it('*Appointment\'s methods should pass call to instance', () => {
      const addAppointment = jest.fn();
      const deleteAppointment = jest.fn();
      const updateAppointment = jest.fn();

      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.instance = {
        addAppointment,
        deleteAppointment,
        updateAppointment,
      } as any;

      scheduler.addAppointment({
        startDate: new Date(2021, 5, 15, 12),
        endDate: new Date(2021, 5, 15, 14),
        text: 'temp',
      });
      expect(addAppointment).toHaveBeenCalled();

      scheduler.deleteAppointment({
        startDate: new Date(2021, 5, 15, 12),
        endDate: new Date(2021, 5, 15, 14),
        text: 'temp',
      });
      expect(deleteAppointment).toHaveBeenCalled();

      scheduler.updateAppointment({
        startDate: new Date(2021, 5, 15, 12),
        endDate: new Date(2021, 5, 15, 14),
        text: 'temp',
      }, {
        startDate: new Date(2021, 5, 15, 12),
        endDate: new Date(2021, 5, 15, 14),
        text: 'changed',
      });
      expect(updateAppointment).toHaveBeenCalled();
    });

    it('getDataSource should pass call to instance', () => {
      const getDataSource = jest.fn();
      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.instance = {
        getDataSource,
      } as any;

      scheduler.getDataSource();

      expect(getDataSource).toHaveBeenCalled();
    });

    it('*appointmentPopup and *appointmentTooltip should pass call to instance', () => {
      const hideAppointmentPopup = jest.fn();
      const hideAppointmentTooltip = jest.fn();

      const showAppointmentPopup = jest.fn();
      const showAppointmentTooltip = jest.fn();

      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.instance = {
        hideAppointmentPopup,
        hideAppointmentTooltip,
        showAppointmentPopup,
        showAppointmentTooltip,
      } as any;

      scheduler.hideAppointmentPopup();
      expect(hideAppointmentPopup).toHaveBeenCalled();

      scheduler.hideAppointmentTooltip();
      expect(hideAppointmentTooltip).toHaveBeenCalled();

      scheduler.showAppointmentPopup();
      expect(showAppointmentPopup).toHaveBeenCalled();

      scheduler.showAppointmentTooltip({}, '');
      expect(showAppointmentTooltip).toHaveBeenCalled();
    });

    it('getEndViewDate and getStartViewDate should pass call to instance', () => {
      const getEndViewDate = jest.fn();
      const getStartViewDate = jest.fn();

      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.instance = {
        getEndViewDate,
        getStartViewDate,
      } as any;

      scheduler.getEndViewDate();
      expect(getEndViewDate).toHaveBeenCalled();

      scheduler.getStartViewDate();
      expect(getStartViewDate).toHaveBeenCalled();
    });

    it('scroll* methods should pass call to instance', () => {
      const scrollTo = jest.fn();
      const scrollToTime = jest.fn();

      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.instance = {
        scrollTo,
        scrollToTime,
      } as any;

      scheduler.scrollTo(new Date());
      expect(scrollTo).toHaveBeenCalled();

      scheduler.scrollToTime(12, 12);
      expect(scrollToTime).toHaveBeenCalled();
    });
  });

  it('should be rendered', () => {
    const tree = mount(viewFunction({} as any));

    expect(tree.is(Widget)).toBe(true);
  });

  it('should spread restAttributes', () => {
    const tree = mount(viewFunction({
      restAttributes: { 'custom-attribute': 'customAttribute' },
    } as any));

    expect(tree.prop('custom-attribute'))
      .toBe('customAttribute');
  });
});
