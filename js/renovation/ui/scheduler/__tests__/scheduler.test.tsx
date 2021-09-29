import React from 'react';
import { shallow } from 'enzyme';
import { SchedulerProps } from '../props';
import { Scheduler, viewFunction as ViewFunction } from '../scheduler';
import { Widget, WidgetProps } from '../../common/widget';
import * as viewsModel from '../model/views';
import { ViewType } from '../types';
import ViewDataProvider from '../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { WorkSpace } from '../workspaces/base/work_space';
import { getAppointmentDataProvider, getTimeZoneCalculator } from '../../../../ui/scheduler/instanceFactory';
import { SchedulerToolbar } from '../header/header';
import * as resourceUtils from '../../../../ui/scheduler/resources/utils';
import { Group } from '../workspaces/types';

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

      indicatorTime: undefined,
      allowMultipleCellSelection: true,
      allDayPanelExpanded: false,
      type: 'week',
    };
    const renderComponent = (viewModel) => shallow(
      <ViewFunction
        currentViewConfig={defaultCurrentViewConfig}
        {...viewModel}
        props={{
          ...new SchedulerProps(),
          ...viewModel.props,
        }}
      />,
    );

    it('should render widget', () => {
      const tree = renderComponent({});

      expect(tree.is(Widget)).toBe(true);
    });

    it('should pass correct props to the widget', () => {
      const props = {
        accessKey: 'A',
        activeStateEnabled: true,
        disabled: true,
        focusStateEnabled: false,
        height: 100,
        hint: 'hint',
        hoverStateEnabled: true,
        rtlEnabled: true,
        tabIndex: -2,
        visible: true,
        width: 200,
        className: 'custom-class',
      };
      const tree = renderComponent({
        restAttributes: { 'custom-attribute': 'customAttribute' },
        props,
      });

      expect(tree.props())
        .toEqual({
          ...new WidgetProps(),
          'custom-attribute': 'customAttribute',
          classes: 'dx-scheduler',
          ...props,
          children: expect.anything(),
        });
    });

    it('should render scheduler-container', () => {
      const tree = renderComponent({});

      expect(tree.find('.dx-scheduler-container').exists())
        .toBe(true);
    });

    it('should render work space and pass to it correct props', () => {
      const tree = renderComponent({
        onViewRendered: () => {},
      });

      const workSpace = tree.find(WorkSpace);

      expect(workSpace.exists())
        .toBe(true);
      expect(workSpace.props())
        .toEqual({
          ...defaultCurrentViewConfig,
          onViewRendered: expect.any(Function),
          appointments: expect.anything(),
          allDayAppointments: expect.anything(),
        });
    });

    it('should render toolbar and pass to it correct props', () => {
      const props = {
        min: new Date(2021, 1, 1),
        max: new Date(2021, 1, 2),
        views: ['month', 'week'],
        currentView: 'month',
        useDropDownViewSwitcher: true,
        toolbar: [
          {
            defaultElement: 'dateNavigator',
            location: 'before',
          },
          {
            defaultElement: 'viewSwitcher',
            location: 'after',
          },
        ],
        customizeDateNavigatorText: () => {},
      };
      const setCurrentDate = () => {};
      const setCurrentView = () => {};
      const startViewDate = new Date(2021, 1, 1);

      const tree = renderComponent({
        props, setCurrentView, setCurrentDate, startViewDate,
      });
      const schedulerToolbar = tree.find(SchedulerToolbar);

      expect(schedulerToolbar.exists())
        .toBe(true);
      expect(schedulerToolbar.props())
        .toEqual({
          currentDate: defaultCurrentViewConfig.currentDate,
          intervalCount: defaultCurrentViewConfig.intervalCount,
          firstDayOfWeek: defaultCurrentViewConfig.firstDayOfWeek,

          items: props.toolbar,
          min: props.min,
          max: props.max,
          views: props.views,
          currentView: props.currentView,
          useDropDownViewSwitcher: props.useDropDownViewSwitcher,
          customizationFunction: props.customizeDateNavigatorText,
          onCurrentViewUpdate: setCurrentView,
          onCurrentDateUpdate: setCurrentDate,
          startViewDate,
        });
    });

    it('should correctly create factory instances', () => {
      const scheduler = new Scheduler(new SchedulerProps());

      scheduler.initialization();

      expect(getAppointmentDataProvider(scheduler.key))
        .toBeDefined();
      expect(getTimeZoneCalculator(scheduler.key))
        .toBeDefined();
    });

    it('should not render toolbar if toolbar prop is an empty array', () => {
      const tree = renderComponent({ props: { toolbar: [] } });
      const schedulerToolbar = tree.find(SchedulerToolbar);

      expect(schedulerToolbar.exists()).toBe(false);
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      it('loadResources should be call with valid arguments', () => {
        const loadResources = jest.spyOn(resourceUtils, 'loadResources');

        const groupsValue = ['priorityId'];
        const resourcesValue = [{
          fieldExpr: 'priorityId',
          dataSource: [{
            text: 'Low Priority',
            id: 1,
            color: '#1e90ff',
          }, {
            text: 'High Priority',
            id: 2,
            color: '#ff9747',
          }],
          label: 'Priority',
        }];

        const scheduler = new Scheduler({
          groups: groupsValue,
          resources: resourcesValue,
        });

        scheduler.loadGroupResources();

        expect(loadResources)
          .toBeCalledWith(groupsValue, resourcesValue, scheduler.resourcePromisesMap);

        expect(scheduler.loadedResources)
          .toEqual([
            {
              name: 'priorityId',
              items: [
                {
                  id: 1,
                  text: 'Low Priority',
                  color: '#1e90ff',
                },
                {
                  id: 2,
                  text: 'High Priority',
                  color: '#ff9747',
                },
              ],
              data: [
                {
                  text: 'Low Priority',
                  id: 1,
                  color: '#1e90ff',
                },
                {
                  text: 'High Priority',
                  id: 2,
                  color: '#ff9747',
                },
              ],
            } as Group,
          ]);
      });
    });

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

      it('should initialize key', () => {
        const scheduler = new Scheduler(new SchedulerProps());

        expect(scheduler.key)
          .toBeGreaterThan(-1);
      });

      it('dataAccessors should be correctly created', () => {
        const scheduler = new Scheduler({
          ...new SchedulerProps(),
          startDateExpr: 'testStartDate',
          endDateExpr: 'testEndDate',
        });

        expect(scheduler.dataAccessors.expr)
          .toEqual({
            startDateExpr: 'testStartDate',
            endDateExpr: 'testEndDate',
            startDateTimeZoneExpr: 'startDateTimeZone',
            endDateTimeZoneExpr: 'endDateTimeZone',
            allDayExpr: 'allDay',
            textExpr: 'text',
            descriptionExpr: 'description',
            recurrenceRuleExpr: 'recurrenceRule',
            recurrenceExceptionExpr: 'recurrenceException',
          });
      });

      describe('onViewRendered', () => {
        it('should save viewDataProvider and cells meta data to the state', () => {
          const scheduler = new Scheduler(new SchedulerProps());

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

      describe('setCurrentView', () => {
        it('should update currentView', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentView: 'day',
          });

          scheduler.setCurrentView('week');

          expect(scheduler.props.currentView)
            .toBe('week');
        });
      });

      describe('setCurrentDate', () => {
        it('should update currentDate', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate: new Date(2021, 1, 1),
          });

          scheduler.setCurrentDate(new Date(2021, 1, 2));

          expect((scheduler.props.currentDate as Date).getTime())
            .toBe(new Date(2021, 1, 2).getTime());
        });
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

      describe('startViewDate', () => {
        it('should return correct startViewDate if view is day', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate: new Date(2021, 1, 1),
          });

          expect(scheduler.startViewDate.getTime())
            .toBe(new Date(2021, 1, 1).getTime());
        });

        it('should return correct startViewDate if view is week', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate: new Date(2021, 7, 19),
            currentView: 'week',
          });

          expect(scheduler.startViewDate.getTime())
            .toBe(new Date(2021, 7, 15).getTime());
        });
      });

      describe('dataAccessors', () => {
        it('should be correctly generated', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(scheduler.dataAccessors.expr)
            .toEqual({
              allDayExpr: 'allDay',
              descriptionExpr: 'description',
              endDateExpr: 'endDate',
              endDateTimeZoneExpr: 'endDateTimeZone',
              recurrenceExceptionExpr: 'recurrenceException',
              recurrenceRuleExpr: 'recurrenceRule',
              startDateExpr: 'startDate',
              startDateTimeZoneExpr: 'startDateTimeZone',
              textExpr: 'text',
            });
        });
      });

      describe('isVirtualScrolling', () => {
        [
          {
            scrollingMode: 'standard',
            viewScrollingMode: 'virtual',
            expected: true,
          },
          {
            scrollingMode: 'virtual',
            viewScrollingMode: 'virtual',
            expected: true,
          },
          {
            scrollingMode: 'standard',
            viewScrollingMode: 'standard',
            expected: false,
          },
          {
            scrollingMode: 'virtual',
            viewScrollingMode: 'standard',
            expected: true,
          },
        ].forEach(({ scrollingMode, viewScrollingMode, expected }) => {
          it(`should has correct value if scheduler scrolling.mode is ${scrollingMode} and view scrolling.mode is ${viewScrollingMode}`, () => {
            const scheduler = new Scheduler({
              ...new SchedulerProps(),
              scrolling: {
                mode: scrollingMode as any,
              },
              views: [{
                type: 'day',
                scrolling: {
                  mode: viewScrollingMode as any,
                },
              }],
            });

            expect(scheduler.isVirtualScrolling)
              .toBe(expected);
          });
        });
      });
    });
  });
});
