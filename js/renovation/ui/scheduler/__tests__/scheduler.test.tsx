import { mount } from 'enzyme';
import { SchedulerProps } from '../props';
import { Scheduler, viewFunction } from '../scheduler';
import { Widget, WidgetProps } from '../../common/widget';
import * as viewsModel from '../model/views';
import { ViewType } from '../types';

const getCurrentViewProps = jest.spyOn(viewsModel, 'getCurrentViewProps');
const getCurrentViewConfig = jest.spyOn(viewsModel, 'getCurrentViewConfig');

describe('Scheduler', () => {
  describe('Render', () => {
    it('should be rendered', () => {
      const tree = mount(viewFunction({ props: {} } as any));

      expect(tree.is(Widget)).toBe(true);
    });

    it('should pass correct props to the widget', () => {
      const props = {
        accessKey: 'A',
        activeStateEnabled: true,
        disabled: true,
        focusStateEnabled: true,
        height: 100,
        hint: 'hint',
        hoverStateEnabled: true,
        rtlEnabled: true,
        tabIndex: -2,
        visible: true,
        width: 200,
        className: 'custom-class',
      };
      const tree = mount(viewFunction({
        restAttributes: { 'custom-attribute': 'customAttribute' },
        props,
      } as any));

      expect(tree.props())
        .toEqual({
          ...new WidgetProps(),
          'custom-attribute': 'customAttribute',
          classes: 'dx-scheduler',
          ...props,
        });
    });
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
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
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('currentViewProps', () => {
        it('should return correct current view', () => {
          const views: ViewType[] = ['day', 'week', 'month'];
          const scheduler = new Scheduler({
            views,
            currentView: 'week',
          });

          const { currentViewProps } = scheduler;

          expect(currentViewProps)
            .toEqual({ type: 'week' });
          expect(getCurrentViewProps)
            .toBeCalledWith('week', views);
        });
      });

      describe('currentViewConfig', () => {
        it('should return correct current view config', () => {
          const views: ViewType[] = ['day', 'week', 'month'];
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            views,
            currentView: 'week',
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          scheduler.currentViewConfig;

          expect(getCurrentViewConfig)
            .toHaveBeenCalledWith({ type: 'week' }, scheduler.props);
        });
      });
    });
  });
});
