import React from 'react';
import { shallow } from 'enzyme';
import { SchedulerProps } from '../props';
import { Scheduler, viewFunction as ViewFunction } from '../scheduler';
import { Widget } from '../../common/widget';
import * as viewsModel from '../model/views';
import { ViewType } from '../types';
import { WorkSpaceWeek } from '../workspaces/week/work_space';
import ViewDataProvider from '../../../../ui/scheduler/workspaces/view_model/view_data_provider';

const getCurrentViewProps = jest.spyOn(viewsModel, 'getCurrentViewProps');
const getCurrentViewConfig = jest.spyOn(viewsModel, 'getCurrentViewConfig');

describe('Scheduler', () => {
  describe('Render', () => {
    const defaultCurrentViewConfig = {
      firstDayOfWeek: 0,
      startDayHour: 5,
      endDayHour: 7,
      cellDuration: 30,
      groupByDate: false,
      scrolling: { mode: 'standard' },
      currentDate: new Date(2021, 8, 11),
      intervalCount: 1,
      groupOrientation: 'horizontal',
      startDate: null,
      showAllDayPanel: true,
      showCurrentTimeIndicator: false,
      indicatorUpdateInterval: 30000,
      shadeUntilCurrentTime: false,
      crossScrollingEnabled: false,
      hoursInterval: 0.5,
      groups: [],

      indicatorTime: undefined,
      allowMultipleCellSelection: true,
      allDayPanelExpanded: false,
    };
    const renderComponent = (viewModel) => shallow(
      <ViewFunction
        currentViewConfig={defaultCurrentViewConfig}
        workSpace={WorkSpaceWeek}
        {...viewModel}
      />,
    );

    it('should be rendered', () => {
      const tree = renderComponent({});

      expect(tree.is(Widget)).toBe(true);
    });

    it('should pass correct props to the widget', () => {
      const tree = renderComponent({
        restAttributes: { 'custom-attribute': 'customAttribute' },
      });

      expect(tree.prop('custom-attribute'))
        .toBe('customAttribute');
      expect(tree.prop('classes'))
        .toBe('dx-scheduler');
    });

    it('should render work space and pass to it correct props', () => {
      const tree = renderComponent({
        workSpace: WorkSpaceWeek,
        onViewRendered: () => {},
      });

      const workSpace = tree.find(WorkSpaceWeek);

      expect(workSpace.exists())
        .toBe(true);
      expect(workSpace.props())
        .toEqual({
          ...defaultCurrentViewConfig,
          onViewRendered: expect.any(Function),
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

      it('onViewRendered should save viewDataProvider and cells meta data to the state', () => {
        const scheduler = new Scheduler({});

        expect(scheduler.viewDataProvider)
          .toBe(undefined);
        expect(scheduler.cellsMetaData)
          .toBe(undefined);

        const viewDataProvider = new ViewDataProvider('week') as any;
        const cellsMetaData = {
          dateTableCellsMeta: [],
          allDayPanelCellsMeta: [],
        };

        scheduler.onViewRendered({
          viewDataProvider,
          cellsMetaData,
        });

        expect(scheduler.viewDataProvider)
          .toBe(viewDataProvider);
        expect(scheduler.cellsMetaData)
          .toBe(cellsMetaData);
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

      describe('workSpace', () => {
        it('should return correct workSpace', () => {
          const scheduler = new Scheduler({
            views: ['week'],
            currentView: 'week',
          });

          expect(scheduler.workSpace)
            .toBe(WorkSpaceWeek);
        });
      });
    });
  });
});
