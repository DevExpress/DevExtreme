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
import { getPreparedDataItems } from '../utils/data';
import { getFilterStrategy } from '../utils/filtering/local';
import combineRemoteFilter from '../utils/filtering/remote';
import { getAppointmentsConfig, getAppointmentsModel } from '../model/appointments';
import { getAppointmentsViewModel } from '../view_model/appointments/appointments';
import { AppointmentsContextProvider } from '../appointments_context_provider';
import { AppointmentEditForm } from '../appointment_edit_form/layout';

jest.mock('../model/appointments', () => ({
  ...jest.requireActual('../model/appointments'),
  getAppointmentsConfig: jest.fn(() => 'Test_getAppointmentsConfig'),
  getAppointmentsModel: jest.fn(() => 'Test_getAppointmentsModel'),
}));

jest.mock('../view_model/appointments/appointments', () => ({
  ...jest.requireActual('../view_model/appointments/appointments'),
  getAppointmentsViewModel: jest.fn(() => 'Test_getAppointmentsViewModel'),
}));

jest.mock('../utils/data', () => ({
  ...jest.requireActual('../utils/data'),
  getPreparedDataItems: jest.fn((items) => `Prepared_${items}`),
}));

jest.mock('../utils/filtering/local', () => ({
  ...jest.requireActual('../utils/filtering/local'),
  getFilterStrategy: jest.fn(() => ({ filter: (items) => `Filter_${items}` })),
}));

jest.mock('../utils/filtering/remote', () => ({
  __esModule: true,
  ...jest.requireActual('../utils/filtering/remote'),
  default: jest.fn(() => 'Test_combineRemoteFilter'),
}));

const getCurrentViewProps = jest.spyOn(viewsModel, 'getCurrentViewProps');
const getCurrentViewConfig = jest.spyOn(viewsModel, 'getCurrentViewConfig');

describe('Scheduler', () => {
  const defaultAppointmentViewModel = {
    regular: [],
    regularCompact: [],
    allDay: [],
    allDayCompact: [],
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
    const startViewDate = new Date(2021, 8, 5);

    const renderComponent = (viewModel) => shallow(
      <ViewFunction
        currentViewConfig={defaultCurrentViewConfig}
        appointmentsViewModel={defaultAppointmentViewModel}
        startViewDate={startViewDate}
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
        classes: 'some-classes',
        props,
      });

      expect(tree.props())
        .toEqual({
          ...new WidgetProps(),
          'custom-attribute': 'customAttribute',
          ...props,
          classes: 'some-classes',
          children: expect.anything(),
        });
    });

    it('should render scheduler-container', () => {
      const tree = renderComponent({});

      expect(tree.find('.dx-scheduler-container').exists())
        .toBe(true);
    });

    it('should render work space and pass to it correct props', () => {
      const templates = {
        dateCellTemplate: jest.fn(),
        dataCellTemplate: jest.fn(),
        timeCellTemplate: jest.fn(),
        resourceCellTemplate: jest.fn(),
      };
      const tree = renderComponent({
        onViewRendered: () => { },
        workSpaceKey: 'workSpaceKey',
        currentViewConfig: {
          ...defaultCurrentViewConfig,
          ...templates,
        },
        props: {
          height: 500,
          width: 600,
        },
      });

      const workSpace = tree.find(WorkSpace);

      expect(workSpace.exists())
        .toBe(true);
      expect(workSpace.props())
        .toEqual({
          ...defaultCurrentViewConfig,
          ...templates,
          startViewDate,
          onViewRendered: expect.any(Function),
          schedulerHeight: 500,
          schedulerWidth: 600,
        });
      expect(workSpace.key())
        .toBe('workSpaceKey');
    });

    it('should render AppointmentsContextProvider', () => {
      const tree = renderComponent({
        appointmentsContextValue: 'appointmentsContextValue',
      });

      const appointmentsContextProvider = tree.find(AppointmentsContextProvider);

      expect(appointmentsContextProvider.exists())
        .toBe(true);
      expect(appointmentsContextProvider.props())
        .toEqual({
          appointmentsContextValue: 'appointmentsContextValue',
          children: expect.anything(),
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
        customizeDateNavigatorText: () => { },
      };
      const setCurrentDate = () => { };
      const setCurrentView = () => { };

      const tree = renderComponent({
        props,
        setCurrentView,
        setCurrentDate,
        startViewDate: new Date(2021, 1, 1),
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
          startViewDate: new Date(2021, 1, 1),
          viewType: 'week',
        });
    });

    it('should not render toolbar if toolbar prop is an empty array', () => {
      const tree = renderComponent({ props: { toolbar: [] } });
      const schedulerToolbar = tree.find(SchedulerToolbar);

      expect(schedulerToolbar.exists()).toBe(false);
    });

    describe('AppointmentEditForm', () => {
      [true, false].forEach((needCreate) => {
        it(`should correctly render AppointmentEditForm if needCreateAppointmentEditForm = ${needCreate}`, () => {
          const scheduler = renderComponent({
            needCreateAppointmentEditForm: needCreate,
            appointmentPopupSize: {
              fullScreen: false,
              maxWidth: 1000,
            },
          });

          const editForm = scheduler.find(AppointmentEditForm);

          expect(editForm.exists())
            .toBe(needCreate);
        });
      });
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('loadGroupResources', () => {
        it('loadGroupResources should load resources necessary for grouping', () => {
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
            ...new SchedulerProps(),
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
              },
            ]);
        });

        it('loadGroupResources should work when "groups" is a part of view config', () => {
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
            resources: resourcesValue,
            views: [{
              type: 'week',
              groups: groupsValue,
            }],
            currentView: 'week',
          });

          scheduler.loadGroupResources();

          expect(loadResources)
            .toBeCalledWith(groupsValue, resourcesValue, scheduler.resourcePromisesMap);

          expect(scheduler.loadedResources)
            .toEqual([{
              name: 'priorityId',
              items: [{
                id: 1,
                text: 'Low Priority',
                color: '#1e90ff',
              }, {
                id: 2,
                text: 'High Priority',
                color: '#ff9747',
              }],
              data: [{
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff',
              }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747',
              }],
            }]);
        });
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

          scheduler.workSpaceViewModel = {} as any;

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

          scheduler.workSpaceViewModel = {} as any;

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

        describe('Remote filtering', () => {
          it('should apply remote filter', () => {
            const userFilter = ['Some value', '>', 'Other value'];
            const data = [{
              startDate: new Date(2021, 9, 6, 15, 15),
              endDate: new Date(2021, 9, 6, 16, 16),
              allDay: false,
            }];
            const scheduler = new Scheduler({
              ...new SchedulerProps(),
              dataSource: data,
              remoteFiltering: true,
              dateSerializationFormat: 'Some format',
            });

            jest.spyOn(scheduler, 'startViewDate', 'get')
              .mockReturnValue(new Date(2021, 10, 24, 9));
            scheduler.lastViewDateByEndDayHour = new Date(2021, 10, 24, 18);

            const { internalDataSource } = scheduler;
            internalDataSource.filter(userFilter);
            jest.spyOn(scheduler, 'internalDataSource', 'get')
              .mockReturnValue(internalDataSource);

            scheduler.loadDataSource();

            expect(scheduler.internalDataSource.filter())
              .toBe('Test_combineRemoteFilter');

            expect(combineRemoteFilter)
              .toBeCalledWith({
                dataAccessors: expect.anything(),
                dataSourceFilter: userFilter,
                min: new Date(2021, 10, 24, 9),
                max: new Date(2021, 10, 24, 18),
                dateSerializationFormat: 'Some format',
              });
          });
        });
      });
    });

    describe('Methods', () => {
      describe('Public API', () => {
        it('Non-implemented methods should not throw errors', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(() => scheduler.addAppointment({
            startDate: new Date(2021, 5, 15, 12),
            endDate: new Date(2021, 5, 15, 14),
            text: 'temp',
          }))
            .not.toThrow();
          expect(() => scheduler.deleteAppointment({
            startDate: new Date(2021, 5, 15, 12),
            endDate: new Date(2021, 5, 15, 14),
            text: 'temp',
          }))
            .not.toThrow();
          expect(() => scheduler.updateAppointment({
            startDate: new Date(2021, 5, 15, 12),
            endDate: new Date(2021, 5, 15, 14),
            text: 'temp',
          }, {
            startDate: new Date(2021, 5, 15, 12),
            endDate: new Date(2021, 5, 15, 14),
            text: 'changed',
          }))
            .not.toThrow();

          expect(() => scheduler.showAppointmentPopup())
            .not.toThrow();
          expect(() => scheduler.showAppointmentTooltip({}, ''))
            .not.toThrow();
          expect(() => scheduler.hideAppointmentPopup())
            .not.toThrow();

          expect(() => scheduler.scrollTo(new Date()))
            .not.toThrow();
          expect(() => scheduler.scrollToTime(12, 12))
            .not.toThrow();
        });

        it('getDataSource should return an instance of DataSource', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(scheduler.getDataSource())
            .toEqual(expect.any(DataSource));
        });

        it('hideAppointmentTooltip should hide tooltip', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.tooltipVisible = true;
          scheduler.hideAppointmentTooltip();

          expect(scheduler.tooltipVisible)
            .toBe(false);
        });

        it('getEndViewDate and getStartViewDate should work correctly', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate: new Date(2021, 11, 3),
          });

          scheduler.workSpaceViewModel = {
            viewDataProvider: {
              getLastCellEndDate: () => new Date(2021, 11, 4),
            },
          } as any;

          expect(scheduler.getStartViewDate())
            .toEqual(new Date(2021, 11, 3));
          expect(scheduler.getEndViewDate())
            .toEqual(new Date(2021, 11, 4));
        });
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
        it('should save workSpace viewModel into the state', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(scheduler.workSpaceViewModel)
            .toBe(undefined);

          const viewDataProvider = new ViewDataProvider('week') as any;
          viewDataProvider.getLastViewDateByEndDayHour = () => new Date(2021, 11, 6, 15, 15);
          const cellsMetaData = {
            dateTableCellsMeta: [],
            allDayPanelCellsMeta: [],
          };
          const viewDataProviderValidationOptions: any = {};

          const workSpaceViewModel = {
            viewDataProvider,
            cellsMetaData,
            viewDataProviderValidationOptions,
          };

          scheduler.onViewRendered(workSpaceViewModel);

          expect(scheduler.workSpaceViewModel)
            .toBe(workSpaceViewModel);
        });

        it('should save lastViewDateByEndDayHour into the state', () => {
          const scheduler = new Scheduler(new SchedulerProps());
          const expectedDate = new Date(2021, 11, 6, 15, 15);

          expect(scheduler.workSpaceViewModel)
            .toBe(undefined);

          const viewDataProvider = new ViewDataProvider('week') as any;
          viewDataProvider.getLastViewDateByEndDayHour = () => expectedDate;
          const cellsMetaData = {
            dateTableCellsMeta: [],
            allDayPanelCellsMeta: [],
          };
          const viewDataProviderValidationOptions: any = {};

          const workSpaceViewModel = {
            viewDataProvider,
            cellsMetaData,
            viewDataProviderValidationOptions,
          };

          scheduler.onViewRendered(workSpaceViewModel);

          expect(scheduler.lastViewDateByEndDayHour)
            .toBe(expectedDate);
        });

        it('should not save lastViewDateByEndDayHour into the state if lastViewDateByEndDayHour has the same value', () => {
          const scheduler = new Scheduler(new SchedulerProps());
          const testDate = new Date(2021, 11, 6, 15, 15);

          expect(scheduler.workSpaceViewModel)
            .toBe(undefined);

          const viewDataProvider = new ViewDataProvider('week') as any;
          viewDataProvider.getLastViewDateByEndDayHour = () => new Date(2021, 11, 6, 15, 15);
          const cellsMetaData = {
            dateTableCellsMeta: [],
            allDayPanelCellsMeta: [],
          };
          const viewDataProviderValidationOptions: any = {};

          const workSpaceViewModel = {
            viewDataProvider,
            cellsMetaData,
            viewDataProviderValidationOptions,
          };

          scheduler.lastViewDateByEndDayHour = testDate;
          scheduler.onViewRendered(workSpaceViewModel);

          expect(scheduler.lastViewDateByEndDayHour)
            .toBe(testDate);
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

      describe('showTooltip', () => {
        it('should correctly change component state', () => {
          const data = 'data';
          const target = 'target';

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.showTooltip({ data, target } as any);

          expect(scheduler.tooltipVisible)
            .toBe(true);
          expect(scheduler.tooltipTarget)
            .toBe(target);
          expect(scheduler.tooltipData)
            .toBe(data);
        });
      });

      describe('hideTooltip', () => {
        it('should change visible to false', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.tooltipVisible = true;

          scheduler.hideTooltip();

          expect(scheduler.tooltipVisible)
            .toBe(false);
        });
      });

      describe('showReducedIconTooltip', () => {
        it('should correctly change component state', () => {
          const data = 'data';
          const target = 'target';

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.showReducedIconTooltip({ data, target } as any);

          expect(scheduler.reducedIconTooltipVisible)
            .toBe(true);
          expect(scheduler.reducedIconTarget)
            .toBe(target);
        });
      });

      describe('hideReducedIconTooltip', () => {
        it('should change visible to false', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.reducedIconTooltipVisible = true;

          scheduler.hideReducedIconTooltip();

          expect(scheduler.reducedIconTooltipVisible)
            .toBe(false);
        });
      });

      describe('changeAppointmentEditFormVisible', () => {
        [true, false].forEach((visibility) => {
          it(`should correctly set appointmentEditFormVisible if visibility=${visibility}`, () => {
            const scheduler = new Scheduler({
              ...new SchedulerProps(),
            });

            scheduler.changeAppointmentEditFormVisible(visibility);

            expect(scheduler.appointmentEditFormVisible)
              .toBe(visibility);
          });
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
            currentDate: new Date(2021, 1, 1),
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          scheduler.currentViewConfig;

          expect(getCurrentViewConfig)
            .toHaveBeenCalledWith(
              { type: 'week' },
              {
                firstDayOfWeek: 0,
                startDayHour: 0,
                endDayHour: 24,
                cellDuration: 30,
                groupByDate: false,
                scrolling: { mode: 'standard' },
                dataCellTemplate: undefined,
                timeCellTemplate: undefined,
                resourceCellTemplate: undefined,
                dateCellTemplate: undefined,
                appointmentTemplate: undefined,
                appointmentCollectorTemplate: undefined,
                maxAppointmentsPerCell: 'auto',
                showAllDayPanel: true,
                showCurrentTimeIndicator: true,
                indicatorUpdateInterval: 300000,
                shadeUntilCurrentTime: false,
                allDayPanelMode: 'all',
                crossScrollingEnabled: false,
                height: undefined,
                width: undefined,
              },
              new Date(2021, 1, 1),
            );
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

        it('should return correct startViewDate if view name is specified', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            views: [{
              type: 'week',
              name: 'Week',
            }],
            currentView: 'Week',
            currentDate: new Date(2021, 7, 19),
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

      describe('isValidViewDataProvider', () => {
        it('should return true when workSpaceViewModel is equal to scheduler\'s props', () => {
          const scrolling: any = { mode: 'standard' };
          const currentDate = new Date();

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate,
            scrolling,
            views: [{
              type: 'day',
              intervalCount: 1,
            }],
            currentView: 'day',
          });

          const loadedResources = [];

          scheduler.loadedResources = loadedResources;

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {
              intervalCount: 1,
              currentDate,
              type: 'day',
              hoursInterval: 0.5,
              startDayHour: 0,
              endDayHour: 24,
              groupOrientation: undefined,
              groupByDate: false,
              crossScrollingEnabled: false,
              firstDayOfWeek: 0,
              startDate: undefined,
              showAllDayPanel: true,
              allDayPanelExpanded: true,
              scrolling,
              cellDuration: 30,
              groups: loadedResources,
            },
          } as any;

          expect(scheduler.isValidViewDataProvider)
            .toBe(true);
        });

        it('should return true when workSpaceViewModel is equal to scheduler\'s props but intervalCount is undefined', () => {
          const scrolling: any = { mode: 'standard' };
          const currentDate = new Date();

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate,
            scrolling,
            views: [{
              type: 'day',
            }],
            currentView: 'day',
          });

          const loadedResources = [];

          scheduler.loadedResources = loadedResources;

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {
              intervalCount: 1,
              currentDate,
              type: 'day',
              hoursInterval: 0.5,
              startDayHour: 0,
              endDayHour: 24,
              groupOrientation: undefined,
              groupByDate: false,
              crossScrollingEnabled: false,
              firstDayOfWeek: 0,
              startDate: undefined,
              showAllDayPanel: true,
              allDayPanelExpanded: true,
              scrolling,
              cellDuration: 30,
              groups: loadedResources,
            },
          } as any;

          expect(scheduler.isValidViewDataProvider)
            .toBe(true);
        });

        it('should return false when workSpaceViewModel is not equal to scheduler\'s props', () => {
          const scrolling: any = { mode: 'standard' };
          const currentDate = new Date();

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentDate,
            scrolling,
            views: [{
              type: 'day',
            }],
            currentView: 'day',
          });

          const loadedResources = [];

          scheduler.loadedResources = loadedResources;

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {
              intervalCount: 1,
              currentDate: new Date(2020, 10, 15),
              type: 'day',
              hoursInterval: 0.5,
              startDayHour: 0,
              endDayHour: 24,
              groupOrientation: undefined,
              groupByDate: false,
              crossScrollingEnabled: false,
              firstDayOfWeek: 0,
              startDate: undefined,
              showAllDayPanel: true,
              allDayPanelExpanded: true,
              scrolling,
              cellDuration: 30,
              groups: loadedResources,
            },
          } as any;

          expect(scheduler.isValidViewDataProvider)
            .toBe(false);
        });
      });

      describe('appointmentsConfig', () => {
        it('should be created correctly if viewDataProvider and cellsMetaData exists', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {},
          } as any;
          scheduler.loadedResources = [];

          expect(scheduler.appointmentsConfig)
            .toBe('Test_getAppointmentsConfig');

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(1);
        });

        it('should not be created if workSpaceViewModel does not exist', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          expect(scheduler.appointmentsConfig)
            .toBe(undefined);

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(0);
        });

        it('should not be created if workSpaceViewModel is different from scheduler props', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {
              intervalCount: 3,
              currentDate: new Date(2017, 4, 5),
            },
          } as any;

          expect(scheduler.appointmentsConfig)
            .toBe(undefined);

          expect(getAppointmentsConfig)
            .toHaveBeenCalledTimes(0);
        });

        it('should not be created if resources were not loaded', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.workSpaceViewModel = {
            cellsMetaData: {},
            viewDataProvider: new ViewDataProvider('day'),
            viewDataProviderValidationOptions: {},
          } as any;

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

      describe('preparedDataItems', () => {
        it('should return correct items', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.dataItems = 'Test_dataItems' as any;

          expect(scheduler.preparedDataItems)
            .toEqual('Prepared_Test_dataItems');

          expect(getPreparedDataItems)
            .toHaveBeenCalledTimes(1);
        });

        it('should return empty array if appointmentsConfig is not exists', () => {
          const scheduler = new Scheduler(new SchedulerProps());

          scheduler.dataItems = 'dataItems' as any;

          jest.spyOn(scheduler, 'dataAccessors', 'get')
            .mockReturnValue('dataAccessors_test' as any);

          jest.spyOn(scheduler, 'currentViewConfig', 'get')
            .mockReturnValue({ cellDuration: 60 } as any);

          jest.spyOn(scheduler, 'timeZoneCalculator', 'get')
            .mockReturnValue('timeZoneCalculator_test' as any);

          expect(scheduler.preparedDataItems)
            .toEqual('Prepared_dataItems');

          expect(getPreparedDataItems)
            .toHaveBeenCalledTimes(1);

          expect(getPreparedDataItems)
            .toHaveBeenCalledWith(
              'dataItems',
              'dataAccessors_test',
              60,
              'timeZoneCalculator_test',
            );
        });
      });

      describe('filteredItems', () => {
        it('should invoke filterAppointments correctly', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);
          const mockAppointmentsConfig = {
            resources: 'test_resources',
            startDayHour: 1,
            endDayHour: 2,
            cellDurationInMinutes: 3,
            showAllDayPanel: true,
            supportAllDayRow: true,
            firstDayOfWeek: 5,
            viewType: 'typeView',
            dateRange: 123,
            groupCount: 234,
            loadedResources: 'resources',
            isVirtualScrolling: true,
          };

          jest.spyOn(scheduler, 'appointmentsConfig', 'get')
            .mockReturnValue(mockAppointmentsConfig as any);

          const preparedDataItems = jest.spyOn(scheduler, 'preparedDataItems', 'get')
            .mockReturnValue('preparedDataItems_test' as any);

          jest.spyOn(scheduler, 'appointmentsConfig', 'get')
            .mockReturnValue(mockAppointmentsConfig as any);

          jest.spyOn(scheduler, 'timeZoneCalculator', 'get')
            .mockReturnValue('Test_timeZoneCalculator' as any);

          jest.spyOn(scheduler, 'dataAccessors', 'get')
            .mockReturnValue('Test_dataAccessors' as any);

          scheduler.workSpaceViewModel = { viewDataProvider: 'Test_viewDataProvider' } as any;
          scheduler.loadedResources = [];

          expect(scheduler.filteredItems)
            .toBe('Filter_preparedDataItems_test');

          expect(getFilterStrategy)
            .toHaveBeenCalledTimes(1);

          expect(getFilterStrategy)
            .toHaveBeenCalledWith(
              ...Object.values(mockAppointmentsConfig),
              'Test_timeZoneCalculator',
              'Test_dataAccessors',
              'Test_viewDataProvider',
            );

          expect(preparedDataItems)
            .toHaveBeenCalledTimes(1);
        });

        it('should return empty array if appointmentsConfig is not exists', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          scheduler.workSpaceViewModel = {} as any;
          scheduler.loadedResources = [];

          expect(scheduler.filteredItems)
            .toEqual([]);

          expect(getFilterStrategy)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe('appointmentsViewModel', () => {
        it('should be generated correctly if appointmentsConfig is exists', () => {
          const schedulerProps = new SchedulerProps();
          const scheduler = new Scheduler(schedulerProps);

          jest.spyOn(scheduler, 'appointmentsConfig', 'get')
            .mockReturnValue('appointmentsConfig_test' as any);

          jest.spyOn(scheduler, 'filteredItems', 'get')
            .mockReturnValue([{}]);

          scheduler.workSpaceViewModel = {} as any;

          expect(scheduler.appointmentsViewModel)
            .toBe('Test_getAppointmentsViewModel');

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

          expect(getAppointmentsModel)
            .toHaveBeenCalledTimes(0);

          expect(getAppointmentsViewModel)
            .toHaveBeenCalledTimes(0);
        });
      });

      describe('workSpaceKey', () => {
        it('should return empty string if cross-scrolling is not used', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          expect(scheduler.workSpaceKey)
            .toBe('');
        });

        it('should generate correct key if cross-scrolling is used', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            currentView: 'week',
            views: [{
              type: 'week',
              groupOrientation: 'vertical',
              intervalCount: 3,
            }],
            crossScrollingEnabled: true,
          });

          scheduler.loadedResources = [
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
            },
          ];

          expect(scheduler.workSpaceKey)
            .toBe('week_vertical_3_2');
        });

        it('should work when resources aer not loaded', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            crossScrollingEnabled: true,
            currentView: 'day',
            views: [{
              type: 'day',
              intervalCount: 3,
              groupOrientation: 'horizontal',
            }],
          });

          expect(scheduler.workSpaceKey)
            .toBe('day_horizontal_3_0');
        });

        it('should return key if cross-scrolling is not used but virtual scrolling is used', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            scrolling: { mode: 'virtual' },
            currentView: 'day',
            views: [{
              type: 'day',
              intervalCount: 3,
              groupOrientation: 'horizontal',
            }],
          });

          expect(scheduler.workSpaceKey)
            .toBe('day_horizontal_3_0');
        });
      });

      describe('classes', () => {
        [
          {
            value: true,
            expected: 'dx-scheduler dx-scheduler-native dx-scheduler-adaptive',
          },
          {
            value: false,
            expected: 'dx-scheduler dx-scheduler-native',
          },
        ].forEach(({ value, expected }) => {
          it(`should return correct classes if adaptivityEnabled is ${value}`, () => {
            const scheduler = new Scheduler({
              ...new SchedulerProps(),
              adaptivityEnabled: value,
            });

            expect(scheduler.classes)
              .toBe(expected);
          });
        });
      });
    });

    describe('mergedGroups', () => {
      [
        { schedulerGroups: ['groups'], viewGroups: undefined, expected: ['groups'] },
        { schedulerGroups: ['groups'], viewGroups: ['viewGroups'], expected: ['viewGroups'] },
        { schedulerGroups: undefined, viewGroups: ['viewGroups'], expected: ['viewGroups'] },
        { schedulerGroups: undefined, viewGroups: undefined, expected: undefined },
      ].forEach(({ schedulerGroups, viewGroups, expected }) => {
        it(`should return correct value if schedulerGroups=${schedulerGroups}, viewGroups=${viewGroups}`, () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            groups: schedulerGroups,
            views: [{ type: 'day', groups: viewGroups }],
            currentView: 'day',
          });

          expect(scheduler.mergedGroups)
            .toEqual(expected);
        });
      });
    });

    describe('appointmentsContextValue', () => {
      it('should return correct data', () => {
        const appointmentTemplate = jest.fn();
        const appointmentCollectorTemplate = jest.fn();

        const scheduler = new Scheduler({
          ...new SchedulerProps(),
          appointmentTemplate,
          appointmentCollectorTemplate,
        });

        jest.spyOn(scheduler, 'mergedGroups', 'get')
          .mockReturnValue(['mock-groups']);

        jest.spyOn(scheduler, 'dataAccessors', 'get')
          .mockReturnValue('dataAccessors-test' as any);

        expect(scheduler.appointmentsContextValue)
          .toEqual({
            viewModel: {
              regular: [],
              regularCompact: [],
              allDay: [],
              allDayCompact: [],
            },
            groups: ['mock-groups'],
            resources: [],
            resourceLoaderMap: new Map(),
            loadedResources: undefined,
            dataAccessors: 'dataAccessors-test',
            appointmentTemplate,
            overflowIndicatorTemplate: appointmentCollectorTemplate,
            onAppointmentClick: expect.any(Function),
            onAppointmentDoubleClick: expect.any(Function),
            showReducedIconTooltip: expect.any(Function),
            hideReducedIconTooltip: expect.any(Function),
            updateFocusedAppointment: expect.any(Function),
          });

        const data = { startDate: new Date(2021, 11, 27) };
        scheduler.appointmentsContextValue.onAppointmentClick({
          data,
          target: 'target',
        } as any);

        expect(scheduler.tooltipData)
          .toBe(data);
        expect(scheduler.tooltipTarget)
          .toBe('target');
        expect(scheduler.tooltipVisible)
          .toBe(true);

        const endDate = new Date(2021, 11, 27);
        scheduler.appointmentsContextValue.showReducedIconTooltip({
          target: 'target',
          endDate,
        } as any);

        expect(scheduler.reducedIconEndDate)
          .toBe(endDate);
        expect(scheduler.reducedIconTarget)
          .toBe('target');
        expect(scheduler.reducedIconTooltipVisible)
          .toBe(true);

        scheduler.appointmentsContextValue.hideReducedIconTooltip();

        expect(scheduler.reducedIconTooltipVisible)
          .toBe(false);
      });

      describe('onAppointmentDoubleClick', () => {
        it('should return correct data', () => {
          const appointmentTemplate = jest.fn();
          const appointmentCollectorTemplate = jest.fn();

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
            appointmentTemplate,
            appointmentCollectorTemplate,
          });

          jest.spyOn(scheduler, 'mergedGroups', 'get')
            .mockReturnValue(['mock-groups']);

          jest.spyOn(scheduler, 'dataAccessors', 'get')
            .mockReturnValue('dataAccessors-test' as any);

          const hideTooltip = jest.spyOn(scheduler, 'hideTooltip');
          const changeAppointmentEditFormVisible = jest.spyOn(scheduler, 'changeAppointmentEditFormVisible');

          const data = [{
            info: {
              isRecurrent: true,
            },
            appointment: {
              startDate: new Date(2022, 5, 14, 8),
              endDate: new Date(2022, 5, 14, 10),
              recurrenceRule: 'SOME_RECURRENCE_RULE',
            },
          }];
          scheduler.appointmentsContextValue.onAppointmentDoubleClick({
            data,
          } as any);

          expect(scheduler.appointmentPopupSize)
            .toEqual({
              fullScreen: false,
              maxWidth: expect.anything(),
            });
          expect(scheduler.appointmentFormData)
            .toEqual(data[0].appointment);
          expect(scheduler.needCreateAppointmentEditForm)
            .toBe(true);

          expect(hideTooltip)
            .toBeCalledTimes(1);

          expect(changeAppointmentEditFormVisible)
            .toBeCalledTimes(1);

          expect(changeAppointmentEditFormVisible)
            .toBeCalledWith(true);
        });
      });
    });

    describe('Methods', () => {
      describe('updateFocusedAppointment', () => {
        it('should correctly init appointmentFocus state', () => {
          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'regular', index: -1 });

          scheduler.updateFocusedAppointment('regular', 10);

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'regular', index: 10 });
        });

        it('should correctly update state for focused regular appointment', () => {
          const appointmentsViewModel = {
            regular: [
              { key: '1', focused: true },
              { key: '2', focused: false },
            ],
            regularCompact: [
              { key: '3', focused: false },
              { key: '4', focused: false },
            ],
            allDay: [
              { key: '5', focused: false },
              { key: '6', focused: false },
            ],
            allDayCompact: [
              { key: '7', focused: false },
              { key: '8', focused: false },
            ],
          } as any;

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.appointmentFocus = { type: 'regular', index: 0 };

          jest.spyOn(scheduler, 'appointmentsViewModel', 'get')
            .mockReturnValue(appointmentsViewModel);

          scheduler.updateFocusedAppointment('regular', 1);

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'regular', index: 1 });

          expect(appointmentsViewModel)
            .toEqual({
              regular: [
                { key: '1', focused: false },
                { key: '2', focused: true },
              ],
              regularCompact: [
                { key: '3', focused: false },
                { key: '4', focused: false },
              ],
              allDay: [
                { key: '5', focused: false },
                { key: '6', focused: false },
              ],
              allDayCompact: [
                { key: '7', focused: false },
                { key: '8', focused: false },
              ],
            });
        });

        it('should correctly update state for focused regularCompact appointment', () => {
          const appointmentsViewModel = {
            regular: [
              { key: '1', focused: false },
              { key: '2', focused: false },
            ],
            regularCompact: [
              { key: '3', focused: true },
              { key: '4', focused: false },
            ],
            allDay: [
              { key: '5', focused: false },
              { key: '6', focused: false },
            ],
            allDayCompact: [
              { key: '7', focused: false },
              { key: '8', focused: false },
            ],
          } as any;

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.appointmentFocus = { type: 'regularCompact', index: 0 };

          jest.spyOn(scheduler, 'appointmentsViewModel', 'get')
            .mockReturnValue(appointmentsViewModel);

          scheduler.updateFocusedAppointment('regularCompact', 1);

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'regularCompact', index: 1 });

          expect(appointmentsViewModel)
            .toEqual({
              regular: [
                { key: '1', focused: false },
                { key: '2', focused: false },
              ],
              regularCompact: [
                { key: '3', focused: false },
                { key: '4', focused: true },
              ],
              allDay: [
                { key: '5', focused: false },
                { key: '6', focused: false },
              ],
              allDayCompact: [
                { key: '7', focused: false },
                { key: '8', focused: false },
              ],
            });
        });

        it('should correctly update state for focused allDay appointment', () => {
          const appointmentsViewModel = {
            regular: [
              { key: '1', focused: false },
              { key: '2', focused: false },
            ],
            regularCompact: [
              { key: '3', focused: false },
              { key: '4', focused: false },
            ],
            allDay: [
              { key: '5', focused: true },
              { key: '6', focused: false },
            ],
            allDayCompact: [
              { key: '7', focused: false },
              { key: '8', focused: false },
            ],
          } as any;

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.appointmentFocus = { type: 'allDay', index: 0 };

          jest.spyOn(scheduler, 'appointmentsViewModel', 'get')
            .mockReturnValue(appointmentsViewModel);

          scheduler.updateFocusedAppointment('allDay', 1);

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'allDay', index: 1 });

          expect(appointmentsViewModel)
            .toEqual({
              regular: [
                { key: '1', focused: false },
                { key: '2', focused: false },
              ],
              regularCompact: [
                { key: '3', focused: false },
                { key: '4', focused: false },
              ],
              allDay: [
                { key: '5', focused: false },
                { key: '6', focused: true },
              ],
              allDayCompact: [
                { key: '7', focused: false },
                { key: '8', focused: false },
              ],
            });
        });

        it('should correctly update state for focused allDayCompact appointment', () => {
          const appointmentsViewModel = {
            regular: [
              { key: '1', focused: false },
              { key: '2', focused: false },
            ],
            regularCompact: [
              { key: '3', focused: false },
              { key: '4', focused: false },
            ],
            allDay: [
              { key: '5', focused: false },
              { key: '6', focused: false },
            ],
            allDayCompact: [
              { key: '7', focused: true },
              { key: '8', focused: false },
            ],
          } as any;

          const scheduler = new Scheduler({
            ...new SchedulerProps(),
          });

          scheduler.appointmentFocus = { type: 'allDayCompact', index: 0 };

          jest.spyOn(scheduler, 'appointmentsViewModel', 'get')
            .mockReturnValue(appointmentsViewModel);

          scheduler.updateFocusedAppointment('allDayCompact', 1);

          expect(scheduler.appointmentFocus)
            .toEqual({ type: 'allDayCompact', index: 1 });

          expect(appointmentsViewModel)
            .toEqual({
              regular: [
                { key: '1', focused: false },
                { key: '2', focused: false },
              ],
              regularCompact: [
                { key: '3', focused: false },
                { key: '4', focused: false },
              ],
              allDay: [
                { key: '5', focused: false },
                { key: '6', focused: false },
              ],
              allDayCompact: [
                { key: '7', focused: false },
                { key: '8', focused: true },
              ],
            });
        });
      });
    });
  });
});
