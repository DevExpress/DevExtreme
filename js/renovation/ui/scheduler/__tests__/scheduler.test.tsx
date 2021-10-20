import React from 'react';
import { shallow } from 'enzyme';
import DataSource from '../../../../data/data_source';
import { SchedulerProps, ScrollingProps } from '../props';
import { Scheduler, viewFunction as ViewFunction } from '../scheduler';
import { Widget, WidgetProps } from '../../common/widget';
import * as viewsModel from '../model/views';
import { ViewType } from '../types';
import ViewDataProvider from '../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { WorkSpace } from '../workspaces/base/work_space';
import { SchedulerToolbar } from '../header/header';
import * as resourceUtils from '../../../../ui/scheduler/resources/utils';
import { Group } from '../workspaces/types';
import { filterAppointments } from '../common';
import { getAppointmentsConfig, getAppointmentsModel } from '../model/appointments';
import { getAppointmentsViewModel } from '../view_model/appointments/appointments';
import { AppointmentLayout } from '../appointment/layout';

jest.mock('../model/appointments', () => ({
  ...jest.requireActual('../model/appointments'),
  getAppointmentsConfig: jest.fn(() => 'Test_getAppointmentsConfig'),
  getAppointmentsModel: jest.fn(() => 'Test_getAppointmentsModel'),
}));

jest.mock('../view_model/appointments/appointments', () => ({
  ...jest.requireActual('../view_model/appointments/appointments'),
  getAppointmentsViewModel: jest.fn(() => 'Test_getAppointmentsViewModel'),
}));

jest.mock('../common', () => ({
  ...jest.requireActual('../common'),
  filterAppointments: jest.fn(() => 'Test_filterAppointments'),
}));
const getCurrentViewProps = jest.spyOn(viewsModel, 'getCurrentViewProps');
const getCurrentViewConfig = jest.spyOn(viewsModel, 'getCurrentViewConfig');

describe('Scheduler', () => {
  const defaultAppointmentViewModel = {
    regular: [],
    allDay: [],
  };

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
        appointmentsViewModel={defaultAppointmentViewModel}
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

    it('should not render toolbar if toolbar prop is an empty array', () => {
      const tree = renderComponent({ props: { toolbar: [] } });
      const schedulerToolbar = tree.find(SchedulerToolbar);

      expect(schedulerToolbar.exists()).toBe(false);
    });

    describe('Appointments', () => {
      it('should render appointments as a property of workspace', () => {
        const props = {
          min: new Date(2021, 9, 7),
          max: new Date(2021, 9, 8),
          views: ['day'],
          currentView: 'day',
        };

        const appointmentsViewModel = {
          regular: [{}],
          allDay: [{}, {}],
        };

        const scheduler = renderComponent({
          props,
          appointmentsViewModel,
        });

        const workspace = scheduler.find(WorkSpace);
        const appointments = workspace.prop('appointments');
        const allDayAppointments = workspace.prop('allDayAppointments');

        expect(appointments.type)
          .toBe(AppointmentLayout);

        expect(appointments.props)
          .toEqual({
            appointments: appointmentsViewModel.regular,
          });

        expect(allDayAppointments.type)
          .toBe(AppointmentLayout);

        expect(allDayAppointments.props)
          .toEqual({
            appointments: appointmentsViewModel.allDay,
          });
      });
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

      describe('loadDataSource', () => {
        it('loadDataSource should load if data items is array', () => {
          const data = [{
            startDate: new Date(2021, 9, 6, 15, 15),
            endDate: new Date(2021, 9, 6, 16, 16),
            allDay: false,
          }];
          const scheduler = new Scheduler({
            dataSource: data,
          });

          scheduler.loadDataSource();

          expect(scheduler.dataItems)
            .toMatchObject(data);
        });

        it('loadDataSource should load if data items is DataSourceOptions', () => {
          const data = [{
            startDate: new Date(2021, 9, 6, 15, 15),
            endDate: new Date(2021, 9, 6, 16, 16),
            allDay: false,
          }];
          const scheduler = new Scheduler({
            dataSource: {
              store: {
                type: 'array',
                data,
              },
            },
          });

          scheduler.loadDataSource();

          expect(scheduler.dataItems)
            .toMatchObject(data);
        });

        it('loadDataSource should not load dataItems if internalDataSource is loaded', () => {
          const data = [{
            startDate: new Date(2021, 9, 6, 15, 15),
            endDate: new Date(2021, 9, 6, 16, 16),
            allDay: false,
          }];
          const scheduler = new Scheduler({
            dataSource: data,
          });

          jest.spyOn(scheduler, 'internalDataSource', 'get')
            .mockReturnValue({
              isLoaded: () => true,
              isLoading: () => false,
            } as any);

          scheduler.loadDataSource();

          expect(scheduler.dataItems)
            .toHaveLength(0);
        });

        it('loadDataSource should not load dataItems if internalDataSource is in loading phase', () => {
          const data = [{
            startDate: new Date(2021, 9, 6, 15, 15),
            endDate: new Date(2021, 9, 6, 16, 16),
            allDay: false,
          }];
          const scheduler = new Scheduler({
            dataSource: data,
          });

          jest.spyOn(scheduler, 'internalDataSource', 'get')
            .mockReturnValue({
              isLoaded: () => false,
              isLoading: () => true,
            } as any);

          scheduler.loadDataSource();

          expect(scheduler.dataItems)
            .toHaveLength(0);
        });
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
    afterEach(() => jest.clearAllMocks());

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
            viewScrolling: { mode: 'virtual' },
            expected: true,
          },
          {
            scrollingMode: 'virtual',
            viewScrolling: { mode: 'virtual' },
            expected: true,
          },
          {
            scrollingMode: 'standard',
            viewScrolling: { mode: 'standard' },
            expected: false,
          },
          {
            scrollingMode: 'virtual',
            viewScrolling: { mode: 'standard' },
            expected: true,
          },
          {
            scrollingMode: 'virtual',
            viewScrolling: undefined,
            expected: true,
          },
          {
            scrollingMode: 'standard',
            viewScrolling: undefined,
            expected: false,
          },
        ].forEach(({ scrollingMode, viewScrolling, expected }) => {
          it(`should has correct value if scheduler scrolling.mode is ${scrollingMode} and view scrolling.mode is ${viewScrolling?.mode}`, () => {
            const scheduler = new Scheduler({
              ...new SchedulerProps(),
              scrolling: {
                mode: scrollingMode as any,
              },
              views: [{
                type: 'day',
                scrolling: viewScrolling as ScrollingProps,
              }],
            });

            expect(scheduler.isVirtualScrolling)
              .toBe(expected);
          });
        });
      });

      describe('timeZoneCalculator', () => {
        it('should be created correctly', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            timeZone: 'America/Los_Angeles',
          });

          expect(scheduler.timeZoneCalculator.getOffsets(new Date(2021, 8, 19), 'Europe/Moscow'))
            .toMatchObject({
              common: -7,
              appointment: 3,
            });
        });
      });

      describe('appointmentsConfig', () => {
        it('should be created correctly if viewDataProvider and cellsMetaData exists', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.cellsMetaData = { } as any;
          scheduler.viewDataProvider = new ViewDataProvider('day') as any;

          expect(scheduler.appointmentsConfig)
            .toBe('Test_getAppointmentsConfig');

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(1);
        });

        it('should not been created if viewDataProvider is not exists', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(scheduler.appointmentsConfig)
            .toBe(undefined);

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(0);
        });

        it('should not been created if cellsMetaData is not exists', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.viewDataProvider = new ViewDataProvider('day') as any;

          expect(scheduler.appointmentsConfig)
            .toBe(undefined);

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe('internalDataSource', () => {
        it('should be created correctly if dataSource is array', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            dataSource: [{
              startDate: new Date(2021, 9, 5),
              endDate: new Date(2021, 9, 6),
            }],
          });

          expect(scheduler.internalDataSource)
            .toBeInstanceOf(DataSource);
        });

        it('should be created correctly if dataSource is DataSource', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            dataSource: new DataSource([{
              startDate: new Date(2021, 9, 5),
              endDate: new Date(2021, 9, 6),
            }]),
          });

          expect(scheduler.internalDataSource)
            .toBeInstanceOf(DataSource);
        });
      });

      describe('filteredItems', () => {
        it('should invoke filterAppointments correctly', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          expect(scheduler.filteredItems)
            .toBe('Test_filterAppointments');

          expect(filterAppointments)
            .toHaveBeenCalledTimes(1);
        });
      });

      describe('appointmentsViewModel', () => {
        it('should be generated correctly if appointmentsConfig is exists', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          jest.spyOn(scheduler, 'appointmentsConfig', 'get')
            .mockReturnValue('appointmentsConfig_test' as any);

          expect(scheduler.appointmentsViewModel)
            .toBe('Test_getAppointmentsViewModel');

          expect(filterAppointments)
            .toHaveBeenCalledTimes(2);

          expect(getAppointmentsModel)
            .toHaveBeenCalledTimes(1);

          expect(getAppointmentsViewModel)
            .toHaveBeenCalledTimes(1);

          expect(getAppointmentsViewModel)
            .toHaveBeenCalledWith(
              'Test_getAppointmentsModel',
              scheduler.filteredItems,
            );
        });

        it('should return empty viewModel if appointmentsConfig is not exist', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          jest.spyOn(scheduler, 'appointmentsConfig', 'get')
            .mockReturnValue(undefined);

          expect(scheduler.appointmentsViewModel)
            .toEqual(defaultAppointmentViewModel);

          expect(filterAppointments)
            .toHaveBeenCalledTimes(0);

          expect(getAppointmentsModel)
            .toHaveBeenCalledTimes(0);

          expect(getAppointmentsViewModel)
            .toHaveBeenCalledTimes(0);
        });

        it('should return empty viewModel if filteredItems is empty', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          jest.spyOn(scheduler, 'filteredItems', 'get')
            .mockReturnValue([]);

          expect(scheduler.appointmentsViewModel)
            .toEqual(defaultAppointmentViewModel);

          expect(filterAppointments)
            .toHaveBeenCalledTimes(0);

          expect(getAppointmentsModel)
            .toHaveBeenCalledTimes(0);

          expect(getAppointmentsViewModel)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
